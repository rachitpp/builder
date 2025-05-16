import express from "express";
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
router.use(protect);

// User routes
router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);
router.post("/profile/picture", uploadProfilePicture);
router.delete("/profile/picture", deleteProfilePicture);

// Admin only routes
router.get("/", authorize("admin"), getAllUsers);
router
  .route("/:id")
  .get(authorize("admin"), getUserById)
  .put(authorize("admin"), updateUserRole)
  .delete(authorize("admin"), deleteUser);

export default router;
