import mongoose, { Schema } from 'mongoose';
import { VendorDocumentSchema } from './VendorDocument.js';
const VendorSchema = new Schema({
    vendorId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    gstNumber: { type: String },
    panNumber: { type: String },
    tenderIds: [{ type: String }],
    documents: [VendorDocumentSchema],
    bidSubmissionDate: { type: String },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : ret.vendorId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
export const VendorModel = mongoose.model('Vendor', VendorSchema);
