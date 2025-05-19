import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { AppError } from "./errorMiddleware";
import type { IUser } from "../models/userModel";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

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

// Admin authorization middleware
export const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("User not authenticated", 401));
  }

  if (req.user.role !== "admin") {
    return next(
      new AppError("Admin privileges required to access this route", 403)
    );
  }

  next();
};

// Redis-based rate limiting middleware
export const rateLimiter = (maxRequests: number, windowMs: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!process.env.REDIS_URL) {
      // Fallback to simple in-memory tracking if Redis isn't available
      return next();
    }

    try {
      // Use IP and route as the key for more granular control
      const ip = req.ip || "unknown";
      const route = req.originalUrl || req.url;
      const key = `ratelimit:${ip}:${route}`;
      const now = Date.now();
      const windowSeconds = Math.floor(windowMs / 1000);

      // Increment the counter and get current value
      const count = await redisClient.incr(key);

      // Set expiration on first request
      if (count === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      // Get TTL (time to live) for the key
      const ttl = await redisClient.ttl(key);

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", maxRequests.toString());
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, maxRequests - count).toString()
      );
      res.setHeader(
        "X-RateLimit-Reset",
        (Math.floor(now / 1000) + ttl).toString()
      );

      // Check if limit exceeded
      if (count > maxRequests) {
        return next(
          new AppError(
            `Too many requests, please try again after ${ttl} seconds`,
            429
          )
        );
      }

      next();
    } catch (error: any) {
      // Log error but proceed (don't block the request if rate limiting fails)
      logger.error(`Rate limiting error: ${error.message}`);
      next();
    }
  };
};
