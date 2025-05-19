import express, { RequestHandler } from "express";
import passport from "passport";
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
  googleCallback,
  linkedinCallback,
} from "../controllers/authController";
import { protect, rateLimiter } from "../middlewares/authMiddleware";

const router = express.Router();

// Rate limit for auth endpoints
const authLimiter = rateLimiter(10, 15 * 60 * 1000); // 10 requests per 15 minutes

// Public routes
router.post(
  "/register",
  authLimiter as RequestHandler,
  register as RequestHandler
);
router.post("/login", authLimiter as RequestHandler, login as RequestHandler);
router.get("/logout", logout as RequestHandler);
router.post("/refresh-token", refreshToken as RequestHandler);
router.get("/verify-email/:token", verifyEmail as RequestHandler);
router.post(
  "/forgot-password",
  authLimiter as RequestHandler,
  forgotPassword as RequestHandler
);
router.put(
  "/reset-password/:token",
  authLimiter as RequestHandler,
  resetPassword as RequestHandler
);

// OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Add new route to get Google OAuth URL
router.get("/google/url", (req, res) => {
  const redirectUri = req.query.redirectUri as string;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const state = Buffer.from(
    JSON.stringify({
      redirectUri: redirectUri || `${frontendUrl}/auth/callback/google`,
    })
  ).toString("base64");

  const authorizationUrl = `${
    process.env.API_URL || "http://localhost:5000"
  }/api/auth/google?state=${state}`;

  res.json({ authorizationUrl });
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login`,
  }),
  googleCallback as RequestHandler
);

router.get(
  "/linkedin",
  passport.authenticate("linkedin", { state: "SOME_STATE_VALUE" })
);

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login`,
  }),
  linkedinCallback as RequestHandler
);

// Protected routes
router.get("/me", protect as RequestHandler, getCurrentUser as RequestHandler);
router.put(
  "/update-password",
  protect as RequestHandler,
  updatePassword as RequestHandler
);

export default router;
