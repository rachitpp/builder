import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

// Create nodemailer transporter
const createTransporter = async () => {
  // For production
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // For development, use a test account from Ethereal
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

// Send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = await createTransporter();

    const mailOptions: SendMailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Add HTML if provided
    if (options.html) {
      mailOptions.html = options.html;
    }

    const info = await transporter.sendMail(mailOptions);

    // Log the URL for development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  verificationToken: string,
  firstName: string
): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const message = `
    Hello ${firstName},
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    If you did not create an account, please ignore this email.
    
    Thank you,
    The Resume Builder Team
  `;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #495057;">Verify Your Email</h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e9ecef;">
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>Thank you for creating an account with Resume Builder. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4361ee; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Thank you,<br>The Resume Builder Team</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Email Verification - Resume Builder',
    message,
    html,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  firstName: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const message = `
    Hello ${firstName},
    
    You are receiving this email because you (or someone else) has requested a password reset.
    Please click on the following link to reset your password:
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you did not request this, please ignore this email and your password will remain unchanged.
    
    Thank you,
    The Resume Builder Team
  `;

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
        <h1 style="color: #495057;">Reset Your Password</h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 5px 5px; border: 1px solid #e9ecef;">
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>You are receiving this email because you (or someone else) has requested a password reset.</p>
        <p>Please click on the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4361ee; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p><strong>This link will expire in 10 minutes.</strong></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>Thank you,<br>The Resume Builder Team</p>
      </div>
    </div>
  `;

  await sendEmail({
    email,
    subject: 'Password Reset - Resume Builder',
    message,
    html,
  });
};