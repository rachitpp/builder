import express from 'express';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateCategories
} from '../controllers/templateController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getTemplates);
router.get('/categories', getTemplateCategories);
router.get('/:id', getTemplate);

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;