import mongoose from "mongoose";
import { logger } from "../utils/logger";

/**
 * Database configuration and connection
 */
export const connectDatabase = async (): Promise<void> => {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/resume-builder";

  try {
    await mongoose.connect(MONGODB_URI);

    logger.info("Connected to MongoDB");

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  }
};
