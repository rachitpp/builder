import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";
import type { IResume } from "../models/resumeModel";

/**
 * PDF Service for advanced resume PDF generation
 */
export class PDFService {
  /**
   * Generate a PDF from a resume
   * @param resume Resume data
   * @param templateName Optional template name (defaults to resume's template or 'modern')
   * @returns Buffer containing the PDF data
   */
  static async generatePDF(
    resume: IResume,
    templateName?: string
  ): Promise<Buffer> {
    try {
      // Get template to use (could be from resume's templateId or provided as parameter)
      const template = templateName || "modern";

      // Generate HTML content from resume data with the specified template
      const htmlContent = await this.generateHTML(resume, template);

      // Launch headless browser
      const browser = await puppeteer.launch({
        headless: true, // Use headless mode
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      try {
        // Create new page
        const page = await browser.newPage();

        // Set content
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Set viewport and print options
        await page.setViewport({ width: 1200, height: 1600 });

        // Create PDF
        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "20mm",
            right: "20mm",
            bottom: "20mm",
            left: "20mm",
          },
          displayHeaderFooter: true,
          headerTemplate: this.getHeaderTemplate(resume.title),
          footerTemplate: this.getFooterTemplate(),
        });

        return pdf as Buffer;
      } finally {
        // Always close the browser
        await browser.close();
      }
    } catch (error: any) {
      logger.error(`PDF generation error: ${error.message}`);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate HTML content from resume data using a specific template
   * @param resume Resume data
   * @param templateName Template name to use
   * @returns HTML string
   */
  private static async generateHTML(
    resume: IResume,
    templateName: string
  ): Promise<string> {
    try {
      // Get template HTML
      const templatePath = path.resolve(
        __dirname,
        `../templates/pdf/${templateName}.html`
      );

      // Check if template exists, otherwise use default
      let templateHTML;
      try {
        templateHTML = fs.existsSync(templatePath)
          ? fs.readFileSync(templatePath, "utf-8")
          : this.getDefaultTemplate();
      } catch (err) {
        logger.warn(
          `Template file not found: ${templatePath}, using default template`
        );
        templateHTML = this.getDefaultTemplate();
      }

      // Replace placeholders with resume data
      const {
        personalInfo,
        education,
        experience,
        skills,
        projects = [],
        certifications = [],
      } = resume;
      const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`;

      // Generate section HTML
      const educationHTML = this.generateEducationHTML(education);
      const experienceHTML = this.generateExperienceHTML(experience);
      const skillsHTML = this.generateSkillsHTML(skills);
      const projectsHTML = this.generateProjectsHTML(projects);
      const certificationsHTML =
        this.generateCertificationsHTML(certifications);

      // Replace placeholders
      const html = templateHTML
        .replace("{{RESUME_TITLE}}", resume.title)
        .replace("{{FULL_NAME}}", fullName)
        .replace("{{JOB_TITLE}}", personalInfo.jobTitle || "")
        .replace("{{EMAIL}}", personalInfo.email || "")
        .replace("{{PHONE}}", personalInfo.phone || "")
        .replace("{{ADDRESS}}", personalInfo.address || "")
        .replace("{{CITY}}", personalInfo.city || "")
        .replace("{{STATE}}", personalInfo.state || "")
        .replace("{{ZIP_CODE}}", personalInfo.zipCode || "")
        .replace("{{COUNTRY}}", personalInfo.country || "")
        .replace("{{LINKEDIN}}", personalInfo.linkedIn || "")
        .replace("{{WEBSITE}}", personalInfo.website || "")
        .replace("{{GITHUB}}", personalInfo.github || "")
        .replace("{{SUMMARY}}", personalInfo.summary || "")
        .replace("{{EDUCATION_SECTION}}", educationHTML)
        .replace("{{EXPERIENCE_SECTION}}", experienceHTML)
        .replace("{{SKILLS_SECTION}}", skillsHTML)
        .replace("{{PROJECTS_SECTION}}", projectsHTML)
        .replace("{{CERTIFICATIONS_SECTION}}", certificationsHTML);

      return html;
    } catch (error: any) {
      logger.error(`HTML generation error: ${error.message}`);
      throw new Error(`Failed to generate HTML: ${error.message}`);
    }
  }

  /**
   * Generate HTML for education section
   */
  private static generateEducationHTML(education: any[]): string {
    if (!education || !education.length) return "";

    const educationItems = education
      .map(
        (edu) => `
      <div class="item">
        <div class="item-title">${edu.degree} ${
          edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""
        }</div>
        <div class="item-subtitle">${edu.institution}</div>
        <div class="item-date">
          ${new Date(edu.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })} - 
          ${
            edu.endDate
              ? new Date(edu.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })
              : "Present"
          }
        </div>
        ${
          edu.description
            ? `<div class="item-description">${edu.description}</div>`
            : ""
        }
      </div>
    `
      )
      .join("");

    return `
      <div class="section">
        <h2>Education</h2>
        ${educationItems}
      </div>
    `;
  }

  /**
   * Generate HTML for experience section
   */
  private static generateExperienceHTML(experience: any[]): string {
    if (!experience || !experience.length) return "";

    const experienceItems = experience
      .map(
        (exp) => `
      <div class="item">
        <div class="item-title">${exp.position}</div>
        <div class="item-subtitle">${exp.company}${
          exp.location ? `, ${exp.location}` : ""
        }</div>
        <div class="item-date">
          ${new Date(exp.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })} - 
          ${
            exp.endDate
              ? new Date(exp.endDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })
              : "Present"
          }
        </div>
        <div class="item-description">${exp.description || ""}</div>
      </div>
    `
      )
      .join("");

    return `
      <div class="section">
        <h2>Experience</h2>
        ${experienceItems}
      </div>
    `;
  }

  /**
   * Generate HTML for skills section
   */
  private static generateSkillsHTML(skills: any[]): string {
    if (!skills || !skills.length) return "";

    const skillItems = skills
      .map(
        (skill) =>
          `<div class="skill">${skill.name}${
            skill.level ? ` (${skill.level})` : ""
          }</div>`
      )
      .join("");

    return `
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-container">
          ${skillItems}
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML for projects section
   */
  private static generateProjectsHTML(projects: any[]): string {
    if (!projects || !projects.length) return "";

    const projectItems = projects
      .map(
        (project) => `
      <div class="item">
        <div class="item-title">${project.name}</div>
        ${
          project.url
            ? `<div class="item-subtitle"><a href="${project.url}" target="_blank">${project.url}</a></div>`
            : ""
        }
        <div class="item-description">${project.description || ""}</div>
      </div>
    `
      )
      .join("");

    return `
      <div class="section">
        <h2>Projects</h2>
        ${projectItems}
      </div>
    `;
  }

  /**
   * Generate HTML for certifications section
   */
  private static generateCertificationsHTML(certifications: any[]): string {
    if (!certifications || !certifications.length) return "";

    const certItems = certifications
      .map(
        (cert) => `
      <div class="item">
        <div class="item-title">${cert.name}</div>
        <div class="item-subtitle">${cert.issuer}</div>
        ${
          cert.date
            ? `<div class="item-date">${new Date(cert.date).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "short" }
              )}</div>`
            : ""
        }
      </div>
    `
      )
      .join("");

    return `
      <div class="section">
        <h2>Certifications</h2>
        ${certItems}
      </div>
    `;
  }

  /**
   * Get header template for PDF
   */
  private static getHeaderTemplate(title: string): string {
    return `
      <div style="font-size: 10px; width: 100%; text-align: center; color: #777;">
        ${title}
      </div>
    `;
  }

  /**
   * Get footer template for PDF with page numbers
   */
  private static getFooterTemplate(): string {
    return `
      <div style="font-size: 10px; width: 100%; text-align: center; color: #777;">
        <span class="pageNumber"></span> / <span class="totalPages"></span>
      </div>
    `;
  }

  /**
   * Get default template when no template file is found
   */
  private static getDefaultTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{RESUME_TITLE}}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
          
          body { 
            font-family: 'Roboto', Arial, sans-serif; 
            margin: 0; 
            padding: 0;
            color: #333;
            line-height: 1.5;
            background-color: #fff;
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
            font-weight: 700;
            margin-bottom: 5px;
            color: #2c3e50;
          }
          .contact {
            font-size: 14px;
            color: #555;
            margin-bottom: 10px;
          }
          .job-title {
            font-size: 18px;
            color: #3498db;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .summary {
            font-size: 14px;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .section {
            margin-bottom: 25px;
          }
          h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 18px;
            color: #2c3e50;
            font-weight: 700;
          }
          .item {
            margin-bottom: 15px;
            page-break-inside: avoid;
          }
          .item-title {
            font-weight: 700;
            font-size: 16px;
            color: #2c3e50;
          }
          .item-subtitle {
            font-size: 14px;
            color: #3498db;
            margin-bottom: 3px;
          }
          .item-date {
            font-size: 14px;
            color: #777;
            margin-bottom: 5px;
            font-weight: 300;
          }
          .item-description {
            font-size: 14px;
            line-height: 1.6;
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
            border: 1px solid #eee;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="name">{{FULL_NAME}}</div>
            <div class="job-title">{{JOB_TITLE}}</div>
            <div class="contact">
              {{EMAIL}} {{PHONE}} {{ADDRESS}} {{CITY}}, {{STATE}} {{ZIP_CODE}} {{COUNTRY}}
              {{LINKEDIN}} {{WEBSITE}} {{GITHUB}}
            </div>
            <div class="summary">{{SUMMARY}}</div>
          </div>
          
          {{EXPERIENCE_SECTION}}
          {{EDUCATION_SECTION}}
          {{SKILLS_SECTION}}
          {{PROJECTS_SECTION}}
          {{CERTIFICATIONS_SECTION}}
        </div>
      </body>
      </html>
    `;
  }
}
