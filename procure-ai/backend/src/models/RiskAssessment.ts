import mongoose, { Schema, Document } from 'mongoose';
import type { RiskAssessment as IRiskAssessment } from '../types/index.js';

export interface RiskAssessmentDoc extends Omit<IRiskAssessment, 'id'>, Document {}

const RiskFactorSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  category: { type: String, required: true },
  impact: { type: String, required: true }
}, { _id: false });

const InconsistencySchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  description: { type: String, required: true },
  document1: { type: String, required: true },
  document2: { type: String, required: true },
  value1: { type: String, required: true },
  value2: { type: String, required: true },
  field: { type: String, required: true }
}, { _id: false });

const RiskAssessmentSchema = new Schema<RiskAssessmentDoc>({
  tenderId: { type: String, required: true, index: true },
  vendorId: { type: String, required: true, index: true },
  overallScore: { type: Number, required: true },
  riskLevel: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  factors: [RiskFactorSchema],
  missingDocuments: [{ type: String }],
  inconsistencies: [InconsistencySchema],
  calculatedAt: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : '';
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const RiskAssessmentModel = mongoose.model<RiskAssessmentDoc>('RiskAssessment', RiskAssessmentSchema);
