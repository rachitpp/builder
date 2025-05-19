import express, { RequestHandler } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import {
  updateProfile,
  getUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// Protected routes for all authenticated users
router.use(protect as RequestHandler);

// User routes
router.get("/profile", getUserProfile as RequestHandler);
router.put("/profile", updateProfile as RequestHandler);
router.post("/profile/picture", uploadProfilePicture as RequestHandler);
router.delete("/profile/picture", deleteProfilePicture as RequestHandler);

// Admin only routes
router.get(
  "/",
  authorize("admin") as RequestHandler,
  getAllUsers as RequestHandler
);
router
  .route("/:id")
  .get(authorize("admin") as RequestHandler, getUserById as RequestHandler)
  .put(authorize("admin") as RequestHandler, updateUserRole as RequestHandler)
  .delete(authorize("admin") as RequestHandler, deleteUser as RequestHandler);

export default router;
