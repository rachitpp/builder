import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/userModel";
import { AppError } from "../middlewares/errorMiddleware";
import type { IUser } from "../models/userModel";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = "uploads/profile-pictures";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = (req.user as IUser)._id;
    const fileExt = path.extname(file.originalname);
    cb(null, `user-${userId}-${Date.now()}${fileExt}`);
  },
});

// Filter for image files only
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
  fileFilter,
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as IUser;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as IUser)._id;
    const { firstName, lastName } = req.body;

    // Prevent updating sensitive fields
    if (req.body.email || req.body.password || req.body.role) {
      throw new AppError(
        "Cannot update email, password or role with this endpoint",
        400
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use multer middleware for single file upload
    const uploadMiddleware = upload.single("profilePicture");

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError("Please upload a file", 400));
      }

      const userId = (req.user as IUser)._id;
      const user = await User.findById(userId);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Delete old profile picture if exists
      if (user.profilePicture) {
        const oldPicturePath = path.join(
          __dirname,
          "..",
          "..",
          user.profilePicture
        );
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Update user with new profile picture path
      user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          profilePicture: user.profilePicture,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/users/profile/picture
// @access  Private
export const deleteProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as IUser)._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if user has a profile picture
    if (!user.profilePicture) {
      throw new AppError("No profile picture to delete", 400);
    }

    // Delete the file
    const picturePath = path.join(__dirname, "..", "..", user.profilePicture);
    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
    }

    // Remove profile picture path from user
    user.profilePicture = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      data: {},
      message: "Profile picture deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN ENDPOINTS

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // Validate role
    if (role !== "user" && role !== "admin") {
      throw new AppError("Role must be either user or admin", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // Prevent admin from deleting themselves
    if (userId === (req.user as IUser)._id.toString()) {
      throw new AppError("Admin cannot delete their own account", 400);
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete user profile picture if exists
    if (user.profilePicture) {
      const picturePath = path.join(__dirname, "..", "..", user.profilePicture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    // Could also cascade delete user's resumes here if needed

    res.status(200).json({
      success: true,
      data: {},
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
