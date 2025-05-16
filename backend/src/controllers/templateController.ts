import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Template from '../models/templateModel';
import { AppError } from '../middlewares/errorMiddleware';
import type { IUser } from '../models/userModel';
import type { ITemplate } from '../models/templateModel';

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Query parameters for filtering
    const category = req.query.category as string;
    const isPremium = req.query.isPremium === 'true';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }

    // Filter by premium status if specified
    if (req.query.isPremium !== undefined) {
      query.isPremium = isPremium;
    }

    // Execute query with pagination
    const [templates, total] = await Promise.all([
      Template.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      Template.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: templates.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get template by ID
// @route   GET /api/templates/:id
// @access  Public
export const getTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      throw new AppError('Invalid template ID', 400);
    }

    const template = await Template.findById(templateId);

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new template (admin only)
// @route   POST /api/templates
// @access  Private/Admin
export const createTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const template = await Template.create(req.body);

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update template (admin only)
// @route   PUT /api/templates/:id
// @access  Private/Admin
export const updateTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      throw new AppError('Invalid template ID', 400);
    }

    const template = await Template.findByIdAndUpdate(templateId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete template (admin only)
// @route   DELETE /api/templates/:id
// @access  Private/Admin
export const deleteTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const templateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      throw new AppError('Invalid template ID', 400);
    }

    const template = await Template.findByIdAndDelete(templateId);

    if (!template) {
      throw new AppError('Template not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Template successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get template categories
// @route   GET /api/templates/categories
// @access  Public
export const getTemplateCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Template.distinct('category');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};