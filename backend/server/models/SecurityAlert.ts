import mongoose, { Schema, Document } from 'mongoose';

export interface ISecurityAlert extends Document {
    userId: mongoose.Types.ObjectId;
    ip: string;
    attempts: number;
    time: string;
    message: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const securityAlertSchema = new Schema<ISecurityAlert>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        ip: {
            type: String,
            required: true,
        },
        attempts: {
            type: Number,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: 'Suspicious login activity detected on your account.',
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const SecurityAlert = mongoose.model<ISecurityAlert>('SecurityAlert', securityAlertSchema);

export default SecurityAlert;
