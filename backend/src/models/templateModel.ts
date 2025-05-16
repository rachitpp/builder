import mongoose from 'mongoose';
import type { Document, Model } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description: string;
  previewImage: string;
  category: 'simple' | 'professional' | 'creative' | 'modern' | 'academic';
  isPremium: boolean;
  cssTemplate: string;
  htmlStructure: string;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Template description is required'],
    },
    previewImage: {
      type: String,
      required: [true, 'Preview image URL is required'],
    },
    category: {
      type: String,
      enum: ['simple', 'professional', 'creative', 'modern', 'academic'],
      required: [true, 'Template category is required'],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    cssTemplate: {
      type: String,
      required: [true, 'CSS template is required'],
    },
    htmlStructure: {
      type: String,
      required: [true, 'HTML structure is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster querying
templateSchema.index({ category: 1 });
templateSchema.index({ isPremium: 1 });

const Template: Model<ITemplate> = mongoose.model<ITemplate>('Template', templateSchema);

export default Template;