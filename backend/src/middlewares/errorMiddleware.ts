import { Request, Response, NextFunction } from "express";

// Interface for custom error
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default values
  let statusCode = 500;
  let message = "Something went wrong";
  const stack = process.env.NODE_ENV === "production" ? "🥞" : err.stack;
  const errors: any = {};

  // If it's our custom error
  if ("statusCode" in err) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose validation error
  if (err.name === "ValidationError" && err instanceof Error) {
    statusCode = 400;
    message = "Validation Error";

    // Parse validation errors if available
    const validationError = err as any;
    if (validationError.errors) {
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message;
      });
    }
  }

  // Mongoose duplicate key error
  if (err.name === "MongoError" && (err as any).code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";

    // Extract the field that caused the duplicate key error
    const error = err as any;
    if (error.keyValue) {
      const field = Object.keys(error.keyValue)[0];
      errors[field] = `${field} already exists`;
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "production" ? undefined : stack,
  });
};
