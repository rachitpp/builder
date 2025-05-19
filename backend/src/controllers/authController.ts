import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../models/userModel";
import { AppError } from "../middlewares/errorMiddleware";
import {
  sendTokenResponse,
  generateToken,
  generateRefreshToken,
} from "../utils/tokenUtil";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailUtil";
import type { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError("User with this email already exists", 400);
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      verificationToken,
      // Set email as verified for development purposes
      isEmailVerified: true,
    });

    // Try to send verification email but don't fail registration if it fails
    try {
      await sendVerificationEmail(email, verificationToken, firstName);
      logger.info(`Verification email sent to ${email}`);
    } catch (emailError) {
      logger.error(`Failed to send verification email: ${emailError}`);
      // Continue with registration even if email fails
    }

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new AppError("Please provide email and password", 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // NOTE: Email verification check is disabled for development
    // if (!user.isEmailVerified) {
    //   throw new AppError("Please verify your email before logging in", 401);
    // }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds
      httpOnly: true,
    });

    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User is already set in req.user from auth middleware
    const user = req.user as IUser;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    // Find user with verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    // Update user
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found with this email", 404);
    }

    // Generate and hash reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiry (10 minutes)
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.firstName);

      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      // If email fails, clean up token and expiry
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      throw new AppError("Email could not be sent", 500);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token from params
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with token and check if token is not expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Invalid or expired token", 400);
    }

    // Set new password and clear token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById((req.user as IUser)._id).select(
      "+password"
    );
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError("Current password is incorrect", 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token using refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try to get the refresh token from cookies first, then from request body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      throw new AppError("No refresh token provided", 401);
    }

    // Verify refresh token
    if (!process.env.JWT_REFRESH_SECRET) {
      logger.error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
      throw new AppError("Server configuration error", 500);
    }

    try {
      // Verify and decode refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      ) as { id: string };

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError("User not found or inactive", 401);
      }

      // Generate new access token
      if (!process.env.JWT_SECRET) {
        logger.error("JWT_SECRET is not defined in environment variables");
        throw new AppError("Server configuration error", 500);
      }

      // @ts-expect-error - JWT signing with string secret is valid at runtime
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "1d",
      });

      // Set cookie options
      const cookieExpireDays =
        parseInt(process.env.JWT_COOKIE_EXPIRE as string) || 1;
      const cookieOptions = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? ("none" as const)
            : ("lax" as const),
        path: "/",
      };

      // Send response with new token
      res.status(200).cookie("token", token, cookieOptions).json({
        success: true,
        token,
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError("Invalid refresh token", 401);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new AppError("Refresh token expired", 401);
      } else if (error instanceof jwt.NotBeforeError) {
        throw new AppError("Token not active yet", 401);
      } else {
        logger.error("Refresh token error:", error);
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      return next(new AppError("Authentication failed", 401));
    }

    // Create tokens
    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Parse JWT_COOKIE_EXPIRE to number (default to 1 if not set or invalid)
    const cookieExpireDays =
      parseInt(process.env.JWT_COOKIE_EXPIRE as string) || 1;
    const refreshExpireDays =
      parseInt(process.env.JWT_REFRESH_EXPIRE_DAYS as string) || 30;

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      expires: new Date(Date.now() + refreshExpireDays * 24 * 60 * 60 * 1000),
      path: "/api/auth/refresh-token", // Restrict path for better security
    };

    // Set cookies
    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Redirect to the frontend dashboard
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    next(error);
  }
};

// @desc    LinkedIn OAuth callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
export const linkedinCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      return next(new AppError("Authentication failed", 401));
    }

    // Create tokens
    const user = req.user as IUser;
    const token = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Parse JWT_COOKIE_EXPIRE to number (default to 1 if not set or invalid)
    const cookieExpireDays =
      parseInt(process.env.JWT_COOKIE_EXPIRE as string) || 1;
    const refreshExpireDays =
      parseInt(process.env.JWT_REFRESH_EXPIRE_DAYS as string) || 30;

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? ("none" as const)
          : ("lax" as const),
      path: "/",
    };

    const refreshCookieOptions = {
      ...cookieOptions,
      expires: new Date(Date.now() + refreshExpireDays * 24 * 60 * 60 * 1000),
      path: "/api/auth/refresh-token", // Restrict path for better security
    };

    // Set cookies
    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Redirect to the frontend dashboard
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/dashboard`);
  } catch (error) {
    next(error);
  }
};
