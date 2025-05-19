import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Resume from "../models/resumeModel";
import { AppError } from "../middlewares/errorMiddleware";
import type { IUser } from "../models/userModel";
import { CacheService } from "../services/cacheService";
import { PDFService } from "../services/pdfService";

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Add user to request body
    req.body.user = (req.user as IUser)._id;

    // Check if templateId is a mock ID (starts with 'template')
    if (
      req.body.templateId &&
      typeof req.body.templateId === "string" &&
      req.body.templateId.startsWith("template")
    ) {
      console.log(
        "Converting mock template ID to ObjectId:",
        req.body.templateId
      );
      // Use a default template ID or create a new ObjectId
      req.body.templateId = new mongoose.Types.ObjectId();
    }

    // Validate that we have a valid templateId
    if (!req.body.templateId) {
      throw new AppError("Template ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.templateId)) {
      throw new AppError("Invalid template ID format", 400);
    }

    // Validate required personal info fields
    if (!req.body.personalInfo) {
      throw new AppError("Personal information is required", 400);
    }

    const { firstName, lastName, email } = req.body.personalInfo;
    if (!firstName) throw new AppError("First name is required", 400);
    if (!lastName) throw new AppError("Last name is required", 400);
    if (!email) throw new AppError("Email is required", 400);

    // Create resume
    console.log("Creating resume with data:", {
      user: req.body.user,
      templateId: req.body.templateId,
      title: req.body.title,
    });

    const resume = await Resume.create(req.body);

    // Invalidate user's resumes cache
    const userId = (req.user as IUser)._id.toString();
    await CacheService.delByPattern(`resumes:user:${userId}*`);

    res.status(201).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    console.error("Resume creation error:", error);

    // If it's a Mongoose validation error, format it better
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return next(
        new AppError(`Validation error: ${validationErrors.join(", ")}`, 400)
      );
    }

    // Pass the error to the error handler
    next(error);
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
export const getResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume
    const resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume or if it's public
    if (resume.user.toString() !== userId.toString() && !resume.isPublic) {
      throw new AppError("Not authorized to access this resume", 403);
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
export const updateResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume first to check ownership
    let resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError("Not authorized to update this resume", 403);
    }

    // Update resume
    resume = await Resume.findByIdAndUpdate(resumeId, req.body, {
      new: true,
      runValidators: true,
    });

    // Invalidate caches for this resume and the user's resume list
    await Promise.all([
      CacheService.delByPattern(`resume:user:${userId}*`),
      CacheService.delByPattern(`resumes:user:${userId}*`),
      CacheService.delByPattern(`resume:public:${resumeId}*`),
    ]);

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
export const deleteResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume first to check ownership
    const resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError("Not authorized to delete this resume", 403);
    }

    // Delete resume
    await Resume.findByIdAndDelete(resumeId);

    // Invalidate caches for this resume and the user's resume list
    await Promise.all([
      CacheService.delByPattern(`resume:user:${userId}*`),
      CacheService.delByPattern(`resumes:user:${userId}*`),
      CacheService.delByPattern(`resume:public:${resumeId}*`),
    ]);

    res.status(200).json({
      success: true,
      data: {},
      message: "Resume successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Make resume public/private
// @route   PUT /api/resumes/:id/visibility
// @access  Private
export const toggleResumeVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;
    const { isPublic } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume first to check ownership
    let resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume
    if (resume.user.toString() !== userId.toString()) {
      throw new AppError("Not authorized to update this resume", 403);
    }

    // Update visibility
    resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        isPublic,
        // Generate a unique URL if making public, remove it if making private
        publicURL: isPublic
          ? `${process.env.FRONTEND_URL}/resume/public/${resumeId}`
          : undefined,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Invalidate caches related to this resume
    await Promise.all([
      CacheService.delByPattern(`resume:user:${userId}*`),
      CacheService.delByPattern(`resume:public:${resumeId}*`),
    ]);

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
export const getPublicResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume
    const resume = await Resume.findById(resumeId);

    // Check if resume exists and is public
    if (!resume || !resume.isPublic) {
      throw new AppError("Resume not found or not publicly available", 404);
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
export const cloneResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume to clone
    const originalResume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!originalResume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume or if it's public
    if (
      originalResume.user.toString() !== userId.toString() &&
      !originalResume.isPublic
    ) {
      throw new AppError("Not authorized to clone this resume", 403);
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

// @desc    Generate PDF for a resume
// @route   GET /api/resumes/:id/pdf
// @access  Private
export const generateResumePDF = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const resumeId = req.params.id;
    const userId = (req.user as IUser)._id;
    const templateName = (req.query.template as string) || "modern";

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      throw new AppError("Invalid resume ID", 400);
    }

    // Find resume
    const resume = await Resume.findById(resumeId);

    // Check if resume exists
    if (!resume) {
      throw new AppError("Resume not found", 404);
    }

    // Check if user owns the resume or if it's public
    if (resume.user.toString() !== userId.toString() && !resume.isPublic) {
      throw new AppError("Not authorized to access this resume", 403);
    }

    // Generate PDF from resume data
    try {
      // Generate PDF using our advanced PDF service
      const pdfBuffer = await PDFService.generatePDF(resume, templateName);

      // Set appropriate headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${resume.title.replace(/\s+/g, "_")}_resume.pdf"`
      );

      // Send the PDF
      res.status(200).send(pdfBuffer);
    } catch (error: any) {
      // If PDF generation fails, fallback to HTML generation
      // Generate HTML content for the resume
      const { title, personalInfo, experience, education, skills } = resume;
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;

      // Generate HTML for education section
      const educationHTML = education.length
        ? `
          <div class="section">
            <h2>Education</h2>
            ${education
              .map(
                (edu) => `
              <div class="item">
                <div class="item-title">${edu.degree} in ${
                  edu.fieldOfStudy
                }</div>
                <div class="item-subtitle">${edu.institution}</div>
                <div class="item-date">${new Date(
                  edu.startDate
                ).getFullYear()} - ${
                  edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"
                }</div>
                ${
                  edu.description
                    ? `<div class="item-description">${edu.description}</div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        `
        : "";

      // Generate HTML for experience section
      const experienceHTML = experience.length
        ? `
          <div class="section">
            <h2>Experience</h2>
            ${experience
              .map(
                (exp) => `
              <div class="item">
                <div class="item-title">${exp.position}</div>
                <div class="item-subtitle">${exp.company}${
                  exp.location ? `, ${exp.location}` : ""
                }</div>
                <div class="item-date">${new Date(
                  exp.startDate
                ).getFullYear()} - ${
                  exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"
                }</div>
                <div class="item-description">${exp.description}</div>
              </div>
            `
              )
              .join("")}
          </div>
        `
        : "";

      // Generate HTML for skills section
      const skillsHTML = skills.length
        ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills-container">
              ${skills
                .map(
                  (skill) =>
                    `<div class="skill">${skill.name}${
                      skill.level ? ` (${skill.level})` : ""
                    }</div>`
                )
                .join("")}
            </div>
          </div>
        `
        : "";

      // Simple HTML content for the resume
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0;
              color: #333;
              line-height: 1.5;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #eee;
              padding-bottom: 20px;
            }
            .name {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .contact {
              font-size: 14px;
              color: #555;
              margin-bottom: 10px;
            }
            .job-title {
              font-size: 18px;
              color: #777;
              margin-bottom: 5px;
            }
            .summary {
              font-size: 14px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 25px;
            }
            h2 {
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .item {
              margin-bottom: 15px;
            }
            .item-title {
              font-weight: bold;
              font-size: 16px;
            }
            .item-subtitle {
              font-size: 14px;
            }
            .item-date {
              font-size: 14px;
              color: #777;
              margin-bottom: 5px;
            }
            .item-description {
              font-size: 14px;
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .skill {
              background: #f5f5f5;
              padding: 5px 10px;
              border-radius: 3px;
              font-size: 14px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="name">${fullName}</div>
              ${
                personalInfo.jobTitle
                  ? `<div class="job-title">${personalInfo.jobTitle}</div>`
                  : ""
              }
              <div class="contact">
                ${personalInfo.email} ${
        personalInfo.phone ? `| ${personalInfo.phone}` : ""
      }
                ${personalInfo.address ? `| ${personalInfo.address}` : ""}
                ${
                  personalInfo.city && personalInfo.state
                    ? `| ${personalInfo.city}, ${personalInfo.state}`
                    : ""
                }
              </div>
              ${
                personalInfo.summary
                  ? `<div class="summary">${personalInfo.summary}</div>`
                  : ""
              }
            </div>
            
            ${experienceHTML}
            ${educationHTML}
            ${skillsHTML}
          </div>
        </body>
        </html>
      `;

      // Return HTML as fallback
      res.setHeader("Content-Type", "text/html");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${title.replace(/\s+/g, "_")}_resume.html"`
      );

      // Send the HTML content
      res.status(200).send(htmlContent);
    }
  } catch (error) {
    next(error);
  }
};
