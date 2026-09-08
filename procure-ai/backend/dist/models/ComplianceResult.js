import mongoose, { Schema } from 'mongoose';
const ComplianceResultSchema = new Schema({
    tenderId: { type: String, required: true, index: true },
    vendorId: { type: String, required: true, index: true },
    requirementId: { type: String, required: true, index: true },
    requirement: { type: Schema.Types.Mixed },
    status: { type: String, required: true, enum: ['compliant', 'non_compliant', 'manual_review'] },
    confidence: { type: Number, required: true },
    confidenceLevel: { type: String, required: true, enum: ['high', 'medium', 'low'] },
    extractedValue: { type: String, default: '' },
    expectedValue: { type: String, default: '' },
    explanation: { type: String, default: '' },
    evidenceDocumentId: { type: String },
    evidenceDocumentName: { type: String, default: '' },
    evidencePage: { type: Number, default: 1 },
    evidenceText: { type: String, default: '' },
    verifiedAt: { type: String, required: true },
    verifiedBy: { type: String, default: 'ProcureAI Engine v2.4' },
    reviewedBy: { type: String },
    reviewedAt: { type: String },
    reviewNotes: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : '';
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
export const ComplianceResultModel = mongoose.model('ComplianceResult', ComplianceResultSchema);
