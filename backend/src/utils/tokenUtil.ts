import jwt from "jsonwebtoken";
import type { IUser } from "../models/userModel";
import type { Response } from "express";
import { logger } from "./logger";

// Generate JWT token
export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  // Cast to any to bypass TypeScript's type checking for jwt.sign
  // @ts-expect-error - JWT signing with string secret is valid at runtime
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d", // Shorter expiration for better security
  });
};

// Generate refresh token
export const generateRefreshToken = (id: string): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }
  // Cast to any to bypass TypeScript's type checking for jwt.sign
  // @ts-expect-error - JWT signing with string secret is valid at runtime
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Set token cookie
export const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  try {
    // Create token
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

    // Send response with cookies
    res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .json({
        success: true,
        token,
        refreshToken,
        user: {
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
    logger.error("Error in sendTokenResponse:", error);
    res.status(500).json({
      success: false,
      message: "Error generating authentication tokens",
    });
  }
};
