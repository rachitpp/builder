import express from "express";
import {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  toggleResumeVisibility,
  getPublicResume,
  cloneResume,
  generateResumePDF,
} from "../controllers/resumeController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Public routes
router.get("/public/:id", getPublicResume);

// Protected routes
router.use(protect); // Apply protection to all routes below

router.route("/").get(getResumes).post(createResume);

router.route("/:id").get(getResume).put(updateResume).delete(deleteResume);

router.put("/:id/visibility", toggleResumeVisibility);
router.post("/:id/clone", cloneResume);
router.get("/:id/pdf", generateResumePDF);

export default router;
