
import mongoose, { Schema } from 'mongoose';

export interface IProject extends mongoose.Document {
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'paused';
    deadline?: Date;
    budget?: number;
    client: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
     {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

projectSchema.index({ workspace: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isDeleted: 1 });

export const Project = mongoose.model<IProject>("Project", projectSchema);