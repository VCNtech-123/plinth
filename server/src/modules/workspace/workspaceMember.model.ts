
import mongoose, { Schema } from "mongoose";

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

export interface IWorkspaceMember {
    _id: mongoose.Types.ObjectId
    workspace: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    role: WorkspaceRole;
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