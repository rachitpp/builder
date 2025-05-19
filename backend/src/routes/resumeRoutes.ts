import express, { RequestHandler } from "express";
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
import { cacheResponse } from "../middlewares/cacheMiddleware";

const router = express.Router();

// Public routes
router.get(
  "/public/:id",
  cacheResponse("resume:public", 3600) as RequestHandler,
  getPublicResume as RequestHandler
);

// Protected routes
router.use(protect as RequestHandler); // Apply protection to all routes below

router.post("/", createResume as RequestHandler);
router.get(
  "/",
  cacheResponse("resumes:user", 300) as RequestHandler,
  getResumes as RequestHandler
); // Cache for 5 minutes
router.get(
  "/:id",
  cacheResponse("resume:user", 300) as RequestHandler,
  getResume as RequestHandler
);
router.put("/:id", updateResume as RequestHandler);
router.delete("/:id", deleteResume as RequestHandler);
router.put("/:id/visibility", toggleResumeVisibility as RequestHandler);
router.post("/:id/clone", cloneResume as RequestHandler);
router.get("/:id/pdf", generateResumePDF as RequestHandler); // PDF generation is resource-intensive, don't cache

export default router;
