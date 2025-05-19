import express, { RequestHandler } from "express";
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateCategories,
} from "../controllers/templateController";
import { protect, authorize } from "../middlewares/authMiddleware";
import { cacheResponse } from "../middlewares/cacheMiddleware";

const router = express.Router();

// Public routes with caching
router.get(
  "/",
  cacheResponse("templates", 1800) as RequestHandler,
  getTemplates as RequestHandler
);
router.get(
  "/categories",
  cacheResponse("templates:categories", 3600) as RequestHandler,
  getTemplateCategories as RequestHandler
);
router.get(
  "/:id",
  cacheResponse("template", 1800) as RequestHandler,
  getTemplate as RequestHandler
);

// Admin-only routes
router.use(protect as RequestHandler);
router.use(authorize("admin") as RequestHandler);

router.post("/", createTemplate as RequestHandler);
router.put("/:id", updateTemplate as RequestHandler);
router.delete("/:id", deleteTemplate as RequestHandler);

export default router;
