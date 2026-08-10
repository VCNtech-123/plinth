import mongoose, { Schema } from 'mongoose';
import { Workspace } from '../workspace/workspace.model';

export interface IClient extends mongoose.Document {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    status: 'active' | 'inactive';
    workspace: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
        },
        notes: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
            default: "active"
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
            }
    },
    {
        timestamps: true,
    }
)

clientSchema.index({ Workspace: 1 });
clientSchema.index({ isDeleted: 1 });

export const Client = mongoose.model<IClient>("Client", clientSchema)