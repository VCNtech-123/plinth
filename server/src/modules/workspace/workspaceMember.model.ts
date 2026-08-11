
import mongoose, { Schema } from "mongoose";
import { IWorkspace } from "./workspace.model";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface IWorkspaceMember {
    _id: mongoose.Types.ObjectId
    workspace: mongoose.Types.ObjectId | IWorkspace;
    user: mongoose.Types.ObjectId;
    role: WorkspaceRole;
    status: "pending" | "active";
    joinedAt: Date;
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
            enum: ["pending", "active"], 
            default: "pending" 
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }
)

workspaceMemberSchema.index(
  { workspace: 1, user: 1 },
  { unique: true }
);
workspaceMemberSchema.index({ user: 1 });

export const WorkspaceMember = mongoose.model<IWorkspaceMember>("WorkspaceMember", workspaceMemberSchema);