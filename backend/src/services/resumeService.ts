import mongoose from "mongoose";
import Resume from "../models/resumeModel";
import Template from "../models/templateModel";
import { AppError } from "../middlewares/errorMiddleware";
import type { IResume } from "../models/resumeModel";
import type { ITemplate } from "../models/templateModel";

/**
 * Resume Service - Contains business logic for handling resumes
 */
export class ResumeService {
  /**
   * Create a new resume
   */
  static async createResume(
    userId: string,
    resumeData: Partial<IResume>,
  ): Promise<IResume> {
    try {
      // Validate template exists
      if (resumeData.templateId) {
        const template = await Template.findById(resumeData.templateId);
        if (!template) {
          throw new AppError("Template not found", 404);
        }
      }

      // Create the resume
      const resume = await Resume.create({
        ...resumeData,
        user: userId,
      });

      return resume;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      throw new AppError(`Failed to create resume: ${error.message}`, 500);
    }
  }

  /**
   * Get all resumes for a user with pagination
   */
  static async getResumes(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    resumes: IResume[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [resumes, total] = await Promise.all([
        Resume.find({ user: userId })
          .skip(skip)
          .limit(limit)
          .sort({ updatedAt: -1 })
          .populate("templateId", "name category"),
        Resume.countDocuments({ user: userId }),
      ]);

      return {
        resumes,
        total,
        page,
        pages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      throw new AppError(`Failed to fetch resumes: ${error.message}`, 500);
    }
  }

  /**
   * Get a single resume by ID
   */
  static async getResumeById(
    resumeId: string,
    userId?: string,
  ): Promise<IResume> {
    try {
      const resume = await Resume.findById(resumeId).populate(
        "templateId",
        "name category cssTemplate htmlStructure",
      );

      if (!resume) {
        throw new AppError("Resume not found", 404);
      }

      // If userId is provided, check if user has permission to access this resume
      if (userId && resume.user.toString() !== userId && !resume.isPublic) {
        throw new AppError("Not authorized to access this resume", 403);
      }

      return resume;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError("Invalid resume ID", 400);
      }
      throw new AppError(`Failed to fetch resume: ${error.message}`, 500);
    }
  }

  /**
   * Update a resume
   */
  static async updateResume(
    resumeId: string,
    userId: string,
    updateData: Partial<IResume>,
  ): Promise<IResume> {
    try {
      // Verify resume exists and belongs to user
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new AppError("Resume not found", 404);
      }

      if (resume.user.toString() !== userId) {
        throw new AppError("Not authorized to update this resume", 403);
      }

      // If templateId is changed, validate it exists
      if (
        updateData.templateId &&
        updateData.templateId !== resume.templateId.toString()
      ) {
        const template = await Template.findById(updateData.templateId);
        if (!template) {
          throw new AppError("Template not found", 404);
        }
      }

      // Update resume
      const updatedResume = await Resume.findByIdAndUpdate(
        resumeId,
        updateData,
        { new: true, runValidators: true },
      ).populate("templateId", "name category cssTemplate htmlStructure");

      if (!updatedResume) {
        throw new AppError("Resume not found", 404);
      }

      return updatedResume;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new AppError(error.message, 400);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError("Invalid resume ID", 400);
      }
      throw new AppError(`Failed to update resume: ${error.message}`, 500);
    }
  }

  /**
   * Delete a resume
   */
  static async deleteResume(resumeId: string, userId: string): Promise<void> {
    try {
      // Verify resume exists and belongs to user
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new AppError("Resume not found", 404);
      }

      if (resume.user.toString() !== userId) {
        throw new AppError("Not authorized to delete this resume", 403);
      }

      await Resume.findByIdAndDelete(resumeId);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError("Invalid resume ID", 400);
      }
      throw new AppError(`Failed to delete resume: ${error.message}`, 500);
    }
  }

  /**
   * Toggle resume visibility (public/private)
   */
  static async toggleVisibility(
    resumeId: string,
    userId: string,
    isPublic: boolean,
  ): Promise<IResume> {
    try {
      // Verify resume exists and belongs to user
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        throw new AppError("Resume not found", 404);
      }

      if (resume.user.toString() !== userId) {
        throw new AppError("Not authorized to update this resume", 403);
      }

      // Update visibility
      const updatedResume = await Resume.findByIdAndUpdate(
        resumeId,
        {
          isPublic,
          publicURL: isPublic
            ? `${process.env.FRONTEND_URL}/resume/public/${resumeId}`
            : undefined,
        },
        { new: true, runValidators: true },
      );

      if (!updatedResume) {
        throw new AppError("Resume not found", 404);
      }

      return updatedResume;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError("Invalid resume ID", 400);
      }
      throw new AppError(
        `Failed to update resume visibility: ${error.message}`,
        500,
      );
    }
  }

  /**
   * Clone a resume
   */
  static async cloneResume(resumeId: string, userId: string): Promise<IResume> {
    try {
      // Fetch original resume
      const originalResume = await Resume.findById(resumeId);
      if (!originalResume) {
        throw new AppError("Resume not found", 404);
      }

      // Check if user can access this resume
      if (
        originalResume.user.toString() !== userId &&
        !originalResume.isPublic
      ) {
        throw new AppError("Not authorized to clone this resume", 403);
      }

      // Create a new resume based on the original
      const resumeData = originalResume.toObject();

      // Remove fields that should be regenerated
      delete resumeData._id;
      delete resumeData.createdAt;
      delete resumeData.updatedAt;
      delete resumeData.publicURL;

      // Set fields for the new resume
      resumeData.user = userId;
      resumeData.title = `${originalResume.title} (Copy)`;
      resumeData.isPublic = false;

      // Create the cloned resume
      const clonedResume = await Resume.create(resumeData);

      return clonedResume;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new AppError("Invalid resume ID", 400);
      }
      throw new AppError(`Failed to clone resume: ${error.message}`, 500);
    }
  }

  /**
   * Generate PDF for a resume
   */
  static async generateResumePDF(
    resumeId: string,
    userId?: string,
  ): Promise<Buffer> {
    try {
      // This would integrate with a PDF generation library
      // For now, we're just returning a placeholder implementation

      // First get the resume
      const resume = await this.getResumeById(resumeId, userId);

      // Generate PDF (this is a placeholder - would actually use a library like puppeteer)
      // In a real implementation, we would:
      // 1. Render the resume HTML using the template
      // 2. Use puppeteer or similar to convert to PDF
      // 3. Return the PDF buffer

      return Buffer.from("PDF content would go here");
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Failed to generate PDF: ${error.message}`, 500);
    }
  }
}
