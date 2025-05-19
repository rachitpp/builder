import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import { errorHandler } from "../middlewares/errorMiddleware";
import setupPassport from "./passport";
import type { Express } from "express";
import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

/**
 * App configuration and middleware setup
 */
export const configureApp = (app: Express): void => {
  // Basic middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Set up session - without Redis for now to avoid complex import issues
  // This can be enhanced with Redis later with proper TypeScript support
  const sessionConfig: session.SessionOptions = {
    secret:
      process.env.SESSION_SECRET || process.env.JWT_SECRET || "session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  };

  app.use(session(sessionConfig));
  logger.info("Session middleware configured");

  // Initialize Passport
  app.use(passport.initialize());
  setupPassport();

  // CORS configuration
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .filter(Boolean);

      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (
        process.env.NODE_ENV === "development" ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(compression());

  // Logging based on environment
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // increased from 100 to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again after 15 minutes",
  });
  app.use("/api/", apiLimiter);

  // Static files
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

  // Routes will go here before error handler

  // Error handling middleware (must be last)
  app.use(function errorHandlerMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    errorHandler(err, req, res, next);
  } as express.ErrorRequestHandler);
};
