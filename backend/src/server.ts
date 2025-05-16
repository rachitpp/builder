import express from "express";
import dotenv from "dotenv";
import type { Express } from "express";
import { logger } from "./utils/logger";
import { connectDatabase } from "./config/database";
import { configureApp } from "./config/app";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "JWT_REFRESH_SECRET", "MONGODB_URI"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Import routes
import userRoutes from "./routes/userRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import templateRoutes from "./routes/templateRoutes";
import authRoutes from "./routes/authRoutes";

// Create Express application
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Configure app middleware
configureApp(app);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/templates", templateRoutes);

// Default route
app.get("/", (_req, res) => {
  res.send("Resume Builder API is running...");
});

// Connect to Database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (error: Error) => {
      logger.error(`Server error: ${error.message}`);
      process.exit(1);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

export default app;
