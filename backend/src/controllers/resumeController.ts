import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Resume from '../models/resumeModel';
import { AppError } from '../middlewares/errorMiddleware';
import type { IUser } from '../models/userModel';
import type { IResume } from '../models/resumeModel';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Add user to request body
    req.body.user = (req.user as IUser)._id;

    // Create resume
    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as IUser)._id;

    // Query parameters for filtering, pagination, etc.
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Create query
    const query = Resume.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 }); // Sort by recently updated

    // Execute query
    const [resumes, total] = await Promise.all([
      query.exec(),
      Resume.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume
    const resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // Check if user owns the resume or if it's public
    if (resume.user.toString() !== userId.toString() && !resume.isPublic) {
      throw new AppError('Not authorized to access this resume', 403);
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume first to check ownership
    let resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this resume', 403);
    }

    // Update resume
    resume = await Resume.findByIdAndUpdate(resumeId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume first to check ownership
    const resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError('Not authorized to delete this resume', 403);
    }

    // Delete resume
    await Resume.findByIdAndDelete(resumeId);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Resume successfully deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Make resume public/private
// @route   PUT /api/resumes/:id/visibility
// @access  Private
export const toggleResumeVisibility = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;
    const { isPublic } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume first to check ownership
    let resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError('Resume not found', 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError('Not authorized to update this resume', 403);
    }

    // Update visibility
    resume = await Resume.findByIdAndUpdate(
      resumeId,
      { 
        isPublic,
        // Generate a unique URL if making public, remove it if making private
        publicURL: isPublic 
          ? `${process.env.FRONTEND_URL}/resume/public/${resumeId}` 
          : undefined
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a public resume
// @route   GET /api/resumes/public/:id
// @access  Public
export const getPublicResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume
    const resume = await Resume.findById(resumeId);

    // Check if resume exists and is public
    if (!resume || !resume.isPublic) {
      throw new AppError('Resume not found or not publicly available', 404);
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clone a resume
// @route   POST /api/resumes/:id/clone
// @access  Private
export const cloneResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError('Invalid resume ID', 400);
    }

    // Find resume to clone
    const originalResume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!originalResume) {
      throw new AppError('Resume not found', 404);
    }

    // Check if user owns the resume or if it's public
    if (originalResume.user.toString() !== userId.toString() && !originalResume.isPublic) {
      throw new AppError('Not authorized to clone this resume', 403);
    }

    // Create a new resume based on the original (with a new title)
    const resumeData: any = originalResume.toObject();
    
    // Remove fields that should be unique or regenerated
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

    res.status(201).json({
      success: true,
      data: clonedResume,
    });
  } catch (error) {
    next(error);
  }
};