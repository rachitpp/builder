import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/userModel';
import { AppError } from '../middlewares/errorMiddleware';
import type { IUser } from '../models/userModel';
import fs from 'fs';
import path from 'path';

/**
 * User Service - Contains business logic for handling users
 */
export class UserService {
  /**
   * Register a new user
   */
  static async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');

      // Create new user
      const user = await User.create({
        ...userData,
        verificationToken,
      });

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('Failed to register user', 500);
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to find user', 500);
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<IUser> {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid user ID', 400);
      }
      throw new AppError('Failed to find user', 500);
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<IUser> {
    try {
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        throw new AppError('Invalid or expired token', 400);
      }

      user.isEmailVerified = true;
      user.verificationToken = undefined;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to verify email', 500);
    }
  }

  /**
   * Generate reset password token
   */
  static async generateResetPasswordToken(email: string): Promise<string> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('User not found with this email', 404);
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Hash token and save to database
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      // Set expiry (10 minutes)
      user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
      
      await user.save();

      return resetToken;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to generate reset token', 500);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<IUser> {
    try {
      // Hash token from params
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user with token and check if token is not expired
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError('Invalid or expired token', 400);
      }

      // Set new password and clear token fields
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to reset password', 500);
    }
  }

  /**
   * Update user's password
   */
  static async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<IUser> {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if current password matches
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update password', 500);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updateData: {
      firstName?: string;
      lastName?: string;
    }
  ): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          firstName: updateData.firstName,
          lastName: updateData.lastName 
        },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      throw new AppError('Failed to update profile', 500);
    }
  }

  /**
   * Upload profile picture
   */
  static async uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPicturePath = path.join(__dirname, '..', '..', user.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Set new profile picture path
      user.profilePicture = `/uploads/profile-pictures/${file.filename}`;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to upload profile picture', 500);
    }
  }

  /**
   * Delete profile picture
   */
  static async deleteProfilePicture(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!user.profilePicture) {
        throw new AppError('No profile picture to delete', 400);
      }

      // Delete the file
      const picturePath = path.join(__dirname, '..', '..', user.profilePicture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }

      // Remove profile picture from user
      user.profilePicture = undefined;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete profile picture', 500);
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(page = 1, limit = 10): Promise<{
    users: IUser[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 }),
        User.countDocuments(),
      ]);

      return {
        users,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new AppError('Failed to fetch users', 500);
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<IUser> {
    try {
      // Validate role
      if (role !== 'user' && role !== 'admin') {
        throw new AppError('Role must be either user or admin', 400);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid user ID', 400);
      }
      throw new AppError('Failed to update user role', 500);
    }
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string, adminId: string): Promise<void> {
    try {
      // Prevent admin from deleting themselves
      if (userId === adminId) {
        throw new AppError('Admin cannot delete their own account', 400);
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Delete user profile picture if exists
      if (user.profilePicture) {
        const picturePath = path.join(__dirname, '..', '..', user.profilePicture);
        if (fs.existsSync(picturePath)) {
          fs.unlinkSync(picturePath);
        }
      }

      // Note: In a real application, you might want to handle deleting user's resumes or convert them to anonymous
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid user ID', 400);
      }
      throw new AppError('Failed to delete user', 500);
    }
  }
}