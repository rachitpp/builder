import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';
import type { IUser } from './userModel';

// Section interfaces
export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  isCurrentlyStudying?: boolean;
}

export interface IExperience {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrentJob?: boolean;
}

export interface ISkill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ILanguage {
  name: string;
  proficiency: 'elementary' | 'limited_working' | 'professional_working' | 'full_professional' | 'native';
}

export interface IProject {
  title: string;
  description: string;
  technologies?: string[];
  startDate?: Date;
  endDate?: Date;
  link?: string;
}

export interface ICertification {
  name: string;
  organization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialID?: string;
  credentialURL?: string;
}

export interface IReference {
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
}

// Main Resume interface
export interface IResume extends Document {
  user: IUser['_id'];
  title: string;
  templateId: mongoose.Schema.Types.ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    linkedIn?: string;
    website?: string;
    github?: string;
    summary?: string;
    jobTitle?: string;
  };
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  languages: ILanguage[];
  projects: IProject[];
  certifications: ICertification[];
  references: IReference[];
  customSections: {
    title: string;
    content: string;
  }[];
  isPublic: boolean;
  publicURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    personalInfo: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
      },
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      linkedIn: String,
      website: String,
      github: String,
      summary: String,
      jobTitle: String,
    },
    education: [
      {
        institution: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        description: String,
        isCurrentlyStudying: {
          type: Boolean,
          default: false,
        },
      },
    ],
    experience: [
      {
        company: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        location: String,
        startDate: {
          type: Date,
          required: true,
        },
        endDate: Date,
        description: {
          type: String,
          required: true,
        },
        isCurrentJob: {
          type: Boolean,
          default: false,
        },
      },
    ],
    skills: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      },
    ],
    languages: [
      {
        name: {
          type: String,
          required: true,
        },
        proficiency: {
          type: String,
          enum: ['elementary', 'limited_working', 'professional_working', 'full_professional', 'native'],
          required: true,
        },
      },
    ],
    projects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        technologies: [String],
        startDate: Date,
        endDate: Date,
        link: String,
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
        },
        organization: {
          type: String,
          required: true,
        },
        issueDate: {
          type: Date,
          required: true,
        },
        expiryDate: Date,
        credentialID: String,
        credentialURL: String,
      },
    ],
    references: [
      {
        name: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        email: String,
        phone: String,
      },
    ],
    customSections: [
      {
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicURL: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
resumeSchema.index({ user: 1 });
resumeSchema.index({ isPublic: 1 });

const Resume: Model<IResume> = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;