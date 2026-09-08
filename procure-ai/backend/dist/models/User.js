import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: 'demo123' },
    role: { type: String, required: true, enum: ['officer', 'admin', 'reviewer'], default: 'officer' },
    organization: { type: String, default: 'Procurement Department' },
    avatar: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : '';
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});
export const UserModel = mongoose.model('User', UserSchema);
