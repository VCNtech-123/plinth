
import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "./workspace.model";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface IWorkspaceMember {
    _id: mongoose.Types.ObjectId
    workspace: mongoose.Types.ObjectId | IWorkspace;
    user: mongoose.Types.ObjectId;
    role: WorkspaceRole;
    status: "pending" | "active" | "declined" | "removed";
    joinedAt?: Date;
    removedAt?: Date;
    removedBy?: mongoose.Types.ObjectId;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
    {
        workspace: {
            type: mongoose.Types.ObjectId,
            ref: "Workspace",
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["owner", "admin", "member", "viewer"]
        },
        status: {
           type: String, 
            enum: ["pending", "active", "declined", "removed"], 
            default: "pending" 
        },
        joinedAt: {
            type: Date,
        },
        removedAt: {
            type: Date
        },
        removedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

workspaceMemberSchema.index(
  { workspace: 1, user: 1 },
  { unique: true }
);
workspaceMemberSchema.index({ workspace: 1, status: 1 });
workspaceMemberSchema.index({ user: 1, status: 1 });

export const WorkspaceMember = mongoose.model<IWorkspaceMember>("WorkspaceMember", workspaceMemberSchema);