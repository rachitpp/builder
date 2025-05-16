import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  updatePassword,
  refreshToken,
} from "../controllers/authController";
import { protect, rateLimiter } from "../middlewares/authMiddleware";

const router = express.Router();

// Rate limit for auth endpoints
const authLimiter = rateLimiter(10, 15 * 60 * 1000); // 10 requests per 15 minutes

// Public routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/update-password", protect, updatePassword);

export default router;
