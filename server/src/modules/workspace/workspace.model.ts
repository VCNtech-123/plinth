import mongoose, { Schema } from "mongoose";

export interface IWorkspace {
  _id: mongoose.Types.ObjectId;
  name: string;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  status: "pending" | "active";
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
 
const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        status: {
           type: String, 
            enum: ["pending", "active"], 
            default: "pending" 
        },
        joinedAt: { 
            type: Date, 
            default: Date.now 
        },
    },
    {
        timestamps: true,
    }
);

workspaceSchema.index({ createdBy: 1 });
workspaceSchema.index({ isDeleted: 1 });

export const Workspace = mongoose.model<IWorkspace>("Workspace", workspaceSchema);