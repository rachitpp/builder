import Queue from "bull";
import { PDFService } from "./pdfService";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";
import type { IResume } from "../models/resumeModel";

// Create pdf generation queue
const pdfQueue = new Queue("pdf-generation", {
  redis: process.env.REDIS_URL || "redis://localhost:6379",
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Define enum for job types
export enum JobType {
  GENERATE_PDF = "generate-pdf",
}

// Define job data interfaces
export interface GeneratePDFJobData {
  resume: IResume;
  templateName: string;
  userId: string;
  resumeId: string;
}

/**
 * Queue Service for handling background processing
 */
export class QueueService {
  /**
   * Initialize the queue and process handlers
   */
  static init(): void {
    // Create uploads directory if it doesn't exist
    const pdfDirectory = path.join(__dirname, "../../uploads/pdfs");
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    // Process PDF generation jobs
    pdfQueue.process(JobType.GENERATE_PDF, async (job) => {
      try {
        const { resume, templateName, userId, resumeId } =
          job.data as GeneratePDFJobData;

        logger.info(
          `Processing PDF generation for resume: ${resumeId}, user: ${userId}`
        );

        // Generate PDF
        const pdfBuffer = await PDFService.generatePDF(resume, templateName);

        // Save PDF to file
        const fileName = `${resumeId}_${Date.now()}.pdf`;
        const filePath = path.join(pdfDirectory, fileName);

        fs.writeFileSync(filePath, pdfBuffer);

        logger.info(`PDF generated and saved to ${filePath}`);

        return {
          success: true,
          filePath,
          fileName,
        };
      } catch (error: any) {
        logger.error(`PDF generation job failed: ${error.message}`);
        throw new Error(`PDF generation failed: ${error.message}`);
      }
    });

    // Log queue events
    pdfQueue.on("completed", (job) => {
      logger.info(`Job ${job.id} completed successfully`);
    });

    pdfQueue.on("failed", (job, error) => {
      logger.error(`Job ${job?.id} failed: ${error.message}`);
    });

    pdfQueue.on("error", (error) => {
      logger.error(`Queue error: ${error.message}`);
    });

    logger.info("PDF generation queue initialized");
  }

  /**
   * Add a job to generate a PDF in the background
   * @param resume Resume data
   * @param templateName Template name
   * @param userId User ID
   * @param resumeId Resume ID
   * @returns Job ID
   */
  static async addPDFGenerationJob(
    resume: IResume,
    templateName: string,
    userId: string,
    resumeId: string
  ): Promise<string> {
    const job = await pdfQueue.add(
      JobType.GENERATE_PDF,
      {
        resume,
        templateName,
        userId,
        resumeId,
      },
      {
        priority: 1, // High priority
        jobId: `pdf-${resumeId}-${Date.now()}`,
      }
    );

    return job.id.toString();
  }

  /**
   * Get job status
   * @param jobId Job ID
   * @returns Job status
   */
  static async getJobStatus(jobId: string): Promise<any> {
    const job = await pdfQueue.getJob(jobId);

    if (!job) {
      return { status: "not_found" };
    }

    const state = await job.getState();
    const progress = job.progress;
    const result = job.returnvalue;
    const failReason = job.failedReason;

    return {
      id: job.id,
      status: state,
      progress,
      result,
      error: failReason,
    };
  }

  /**
   * Clean up completed jobs older than 24 hours
   */
  static async cleanupJobs(): Promise<void> {
    // Clean up completed jobs older than 24 hours
    const olderThan = Date.now() - 24 * 60 * 60 * 1000;
    await pdfQueue.clean(olderThan, "completed");

    // Clean up failed jobs older than 7 days
    const olderThan7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
    await pdfQueue.clean(olderThan7Days, "failed");
  }
}
