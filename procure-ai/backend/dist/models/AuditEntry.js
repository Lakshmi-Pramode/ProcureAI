import mongoose, { Schema } from 'mongoose';
const AuditEntrySchema = new Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: String, required: true },
    tenderId: { type: String },
    tenderTitle: { type: String },
    vendorId: { type: String },
    vendorName: { type: String },
    documentId: { type: String },
    documentName: { type: String },
    details: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
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
export const AuditEntryModel = mongoose.model('AuditEntry', AuditEntrySchema);
