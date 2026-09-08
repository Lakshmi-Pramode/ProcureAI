import mongoose, { Schema, Document } from 'mongoose';
import type { VendorDocument as IVendorDocument } from '../types/index.js';

export interface VendorDocumentDoc extends Omit<IVendorDocument, 'id'>, Document {}

export const VendorDocumentSchema = new Schema<VendorDocumentDoc>({
  vendorId: { type: String, required: true, index: true },
  tenderId: { type: String, required: true, index: true },
  documentType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  filePath: { type: String },
  uploadedAt: { type: String, required: true },
  status: { type: String, default: 'uploaded' },
  extractedData: {
    fields: { type: Schema.Types.Mixed, default: {} },
    sourcePage: { type: Number, default: 1 },
    confidence: { type: Number, default: 0.9 },
    rawText: { type: String }
  }
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

export const VendorDocumentModel = mongoose.model<VendorDocumentDoc>('VendorDocument', VendorDocumentSchema);
