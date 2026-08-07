
import mongoose, { Schema } from "mongoose";

export interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
  task: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
);

commentSchema.index({ owner: 1 });
commentSchema.index({ task: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ isDeleted: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);