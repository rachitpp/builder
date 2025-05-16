import mongoose from 'mongoose';
import Template from '../models/templateModel';
import { AppError } from '../middlewares/errorMiddleware';
import type { ITemplate } from '../models/templateModel';

/**
 * Template Service - Contains business logic for handling templates
 */
export class TemplateService {
  /**
   * Get all templates with filtering and pagination
   */
  static async getTemplates(
    options: {
      category?: string;
      isPremium?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    templates: ITemplate[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { category, isPremium, page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      // Build query
      const query: any = {};
      if (category) {
        query.category = category;
      }
      if (isPremium !== undefined) {
        query.isPremium = isPremium;
      }

      const [templates, total] = await Promise.all([
        Template.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ name: 1 }),
        Template.countDocuments(query),
      ]);

      return {
        templates,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new AppError(`Failed to fetch templates: ${error.message}`, 500);
    }
  }

  /**
   * Get a single template by ID
   */
  static async getTemplateById(templateId: string): Promise<ITemplate> {
    try {
      const template = await Template.findById(templateId);

      if (!template) {
        throw new AppError('Template not found', 404);
      }

      return template;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid template ID', 400);
      }
      throw new AppError(`Failed to fetch template: ${error.message}`, 500);
    }
  }

  /**
   * Create a new template (admin only)
   */
  static async createTemplate(templateData: Partial<ITemplate>): Promise<ITemplate> {
    try {
      // Create template
      const template = await Template.create(templateData);
      return template;
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      // Handle duplicate template name error
      if (error.code === 11000) {
        throw new AppError('Template with this name already exists', 400);
      }
      throw new AppError(`Failed to create template: ${error.message}`, 500);
    }
  }

  /**
   * Update a template (admin only)
   */
  static async updateTemplate(templateId: string, updateData: Partial<ITemplate>): Promise<ITemplate> {
    try {
      const updatedTemplate = await Template.findByIdAndUpdate(
        templateId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedTemplate) {
        throw new AppError('Template not found', 404);
      }

      return updatedTemplate;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid template ID', 400);
      }
      // Handle duplicate template name error
      if (error.code === 11000) {
        throw new AppError('Template with this name already exists', 400);
      }
      throw new AppError(`Failed to update template: ${error.message}`, 500);
    }
  }

  /**
   * Delete a template (admin only)
   */
  static async deleteTemplate(templateId: string): Promise<void> {
    try {
      const result = await Template.findByIdAndDelete(templateId);

      if (!result) {
        throw new AppError('Template not found', 404);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError('Invalid template ID', 400);
      }
      throw new AppError(`Failed to delete template: ${error.message}`, 500);
    }
  }

  /**
   * Get all template categories
   */
  static async getTemplateCategories(): Promise<string[]> {
    try {
      const categories = await Template.distinct('category');
      return categories;
    } catch (error: any) {
      throw new AppError(`Failed to fetch template categories: ${error.message}`, 500);
    }
  }

  /**
   * Search templates by keywords
   */
  static async searchTemplates(searchTerm: string): Promise<ITemplate[]> {
    try {
      const templates = await Template.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      });
      
      return templates;
    } catch (error: any) {
      throw new AppError(`Failed to search templates: ${error.message}`, 500);
    }
  }
}