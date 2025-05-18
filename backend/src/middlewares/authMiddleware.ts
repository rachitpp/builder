import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { AppError } from "./errorMiddleware";
import type { IUser } from "../models/userModel";

interface JwtPayload {
  id: string;
}

// Extend Express Request type to include user
// Declare the augmentation for Express Request
declare module "express" {
  interface Request {
    user?: IUser;
  }
}

// Protect routes - Authentication check
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Check if token exists in cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token found
    if (!token) {
      throw new AppError("Not authorized to access this route", 401);
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError("User not found", 401);
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new AppError("Invalid token", 401));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new AppError("Token expired", 401));
      } else if (error instanceof jwt.NotBeforeError) {
        next(new AppError("Token not active", 401));
      } else {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Authorize roles
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role (${req.user.role}) is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

// In-memory store for rate limiting
// Note: For production with multiple instances, use Redis or a similar solution
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically (every 5 minutes)
const cleanupInterval = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts.entries()) {
    if (now > data.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, cleanupInterval);

// Rate limiting middleware
export const rateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Use IP and route as the key for more granular control
    const ip = req.ip || "unknown";
    const route = req.originalUrl || req.url;
    const key = `${ip}:${route}`;
    const now = Date.now();

    // Get or create entry for this key
    let entry = requestCounts.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset existing one
      entry = { count: 0, resetTime: now + windowMs };
      requestCounts.set(key, entry);
    }

    // Increment count
    entry.count++;

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(0, maxRequests - entry.count).toString()
    );
    res.setHeader(
      "X-RateLimit-Reset",
      Math.ceil(entry.resetTime / 1000).toString()
    );

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      return next(
        new AppError(
          `Too many requests, please try again after ${Math.ceil(
            (entry.resetTime - now) / 1000
          )} seconds`,
          429
        )
      );
    }

    next();
  };
};
