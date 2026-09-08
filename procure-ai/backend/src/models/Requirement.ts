import mongoose, { Schema, Document } from 'mongoose';
import type { Requirement as IRequirement } from '../types/index.js';

export interface RequirementDoc extends Omit<IRequirement, 'id'>, Document {}

const RequirementSchema = new Schema<RequirementDoc>({
  tenderId: { type: String, required: true, index: true },
  requirementId: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  mandatory: { type: Boolean, default: true },
  sourcePage: { type: Number, default: 1 },
  sourceText: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : ret.requirementId;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const RequirementModel = mongoose.model<RequirementDoc>('Requirement', RequirementSchema);
