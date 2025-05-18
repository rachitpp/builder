import mongoose from "mongoose";
import User from "../models/userModel";
import dotenv from "dotenv";
import { logger } from "../utils/logger";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    logger.info("Connected to MongoDB for creating test user");
    createTestUser();
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Create test user
async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });

    if (existingUser) {
      logger.info("Test user already exists");
      process.exit(0);
    }

    // Create new test user
    const user = await User.create({
      email: "test@example.com",
      password: "password123", // Will be hashed by the pre-save hook in the model
      firstName: "Test",
      lastName: "User",
      isEmailVerified: true, // Make sure the user is already verified
      role: "user",
    });

    logger.info(`Test user created with ID: ${user._id}`);
    logger.info("Login credentials:");
    logger.info("Email: test@example.com");
    logger.info("Password: password123");

    process.exit(0);
  } catch (error) {
    logger.error("Error creating test user:", error);
    process.exit(1);
  }
}
