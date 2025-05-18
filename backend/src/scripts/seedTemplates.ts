import mongoose from "mongoose";
import dotenv from "dotenv";
import Template from "../models/templateModel";
import { connectDatabase } from "../config/database";
import { logger } from "../utils/logger";

// Load environment variables
dotenv.config();

// Template seed data
const templates = [
  {
    name: "Modern Resume",
    description:
      "A clean and modern resume template with a professional design.",
    thumbnailUrl: "/images/templates/modern.jpg",
    category: "professional",
    sections: [
      "personal",
      "experience",
      "education",
      "skills",
      "projects",
      "awards",
    ],
    isPremium: false,
    layout: {
      type: "single-column",
      colors: ["#1a73e8", "#333333", "#ffffff", "#f5f5f5"],
      fonts: ["Roboto", "Open Sans"],
    },
  },
  {
    name: "Creative Portfolio",
    description: "A creative template perfect for designers and artists.",
    thumbnailUrl: "/images/templates/creative.jpg",
    category: "creative",
    sections: ["personal", "portfolio", "experience", "education", "skills"],
    isPremium: true,
    layout: {
      type: "two-column",
      colors: ["#ff5722", "#212121", "#ffffff", "#eeeeee"],
      fonts: ["Montserrat", "Raleway"],
    },
  },
  {
    name: "Simple Classic",
    description: "A traditional resume template with a timeless design.",
    thumbnailUrl: "/images/templates/classic.jpg",
    category: "traditional",
    sections: ["personal", "experience", "education", "skills", "references"],
    isPremium: false,
    layout: {
      type: "single-column",
      colors: ["#000000", "#555555", "#ffffff", "#f9f9f9"],
      fonts: ["Times New Roman", "Arial"],
    },
  },
  {
    name: "Tech Professional",
    description: "Specially designed for IT professionals and developers.",
    thumbnailUrl: "/images/templates/tech.jpg",
    category: "professional",
    sections: [
      "personal",
      "skills",
      "experience",
      "education",
      "projects",
      "certifications",
    ],
    isPremium: false,
    layout: {
      type: "two-column",
      colors: ["#2196f3", "#263238", "#ffffff", "#eceff1"],
      fonts: ["Source Code Pro", "Roboto"],
    },
  },
  {
    name: "Executive",
    description:
      "An elegant resume template for senior professionals and executives.",
    thumbnailUrl: "/images/templates/executive.jpg",
    category: "professional",
    sections: [
      "personal",
      "summary",
      "experience",
      "education",
      "skills",
      "achievements",
    ],
    isPremium: true,
    layout: {
      type: "single-column",
      colors: ["#3f51b5", "#212121", "#ffffff", "#f5f5f5"],
      fonts: ["Playfair Display", "Roboto"],
    },
  },
];

// Function to seed templates
const seedTemplates = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Delete existing templates
    await Template.deleteMany({});
    logger.info("Deleted existing templates");

    // Insert new templates
    await Template.insertMany(templates);
    logger.info(`Successfully seeded ${templates.length} templates`);

    // Disconnect from database
    await mongoose.disconnect();
    logger.info("Disconnected from database");

    process.exit(0);
  } catch (error: any) {
    logger.error(`Error seeding templates: ${error.message}`);
    process.exit(1);
  }
};

seedTemplates();
