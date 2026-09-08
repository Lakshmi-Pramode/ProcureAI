import mongoose, { Schema } from 'mongoose';
const TenderDocumentSchema = new Schema({
    id: { type: String, required: true },
    tenderId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    filePath: { type: String },
    uploadedAt: { type: String, required: true },
    status: { type: String, default: 'uploaded' }
}, { _id: false });
const TenderSchema = new Schema({
    tenderId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    organization: { type: String, required: true },
    category: { type: String, required: true },
    submissionDeadline: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, default: 'published' },
    documents: [TenderDocumentSchema],
    requirements: [{ type: Schema.Types.Mixed }],
    vendors: [{ type: String }],
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    createdBy: { type: String, default: 'Procurement Officer' },
    analyzedAt: { type: String },
    isAnalyzed: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : ret.tenderId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
export const TenderModel = mongoose.model('Tender', TenderSchema);
