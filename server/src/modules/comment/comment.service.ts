
import { Comment } from "./comment.model";
import mongoose from "mongoose";
import { getTaskByIdService } from '../task/task.service'
import { CommentBody, GetCommentsQuery } from "./comment.validation";
import { GetCommentsResponse, PopulatedComment } from '../../types/comment.types'

export const createCommentService = async (
    taskId: string,
    userId: mongoose.Types.ObjectId,
    data: CommentBody
): Promise<PopulatedComment | null> => {
    
    const existingTask = await getTaskByIdService(taskId, userId);

    if (!existingTask) {
        return null
    }

    const comment = await Comment.create({
        content: data.content,
        task: taskId,
        owner: userId,
        author: userId,
    });

    if (!comment) {
        return null;
    }

    const populatedComment = await Comment.findById(comment._id)
        .populate("author", "_id name email")
        .lean<PopulatedComment>();

    return populatedComment;
}

export const getCommentsByTaskIdService = async (
    taskId: string,
    userId: mongoose.Types.ObjectId,
    query: GetCommentsQuery
): Promise<GetCommentsResponse | null> => {

    const { page, limit } = query;
    const skip = Math.max(0, (page - 1) * limit);

    const existingTask = await getTaskByIdService(taskId, userId);
    const filter = {
        owner: userId,
        author: userId,
        task: taskId,
        isDeleted: false
    }

    if (!existingTask) {
        return null;
    }

    const [comments, total] = await Promise.all([
        Comment.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("author", "_id name email")
            .lean<PopulatedComment[]>(),
        
        Comment.countDocuments(filter)
    ])


    return {
        comments: comments,
        results: total
    };
}

export const deleteCommentService = async (
    id: string,
    userId: mongoose.Types.ObjectId
):Promise<PopulatedComment | null> => {

      const deletedComment = await Comment.findOneAndUpdate(
        {
          _id: id,
          owner: userId,
          isDeleted: false
        },
        {
          isDeleted: true
        },
        {
          new: true
        }
      )
            .populate("author", "_id name email")
            .lean<PopulatedComment>();
    
      return deletedComment;
}

export const restoreCommentService = async (
  id: string, 
  userId: mongoose.Types.ObjectId
): Promise<PopulatedComment | null> => {

  const restoredComment = await Comment.findOneAndUpdate(
    {
      owner: userId,
      _id: id,
      isDeleted: true
    },
    {
      isDeleted: false
    },
    { new: true }
  )
        .populate("author", "_id name email")
        .lean<PopulatedComment>();;

  if (!restoredComment) {
    return null
  }

  return restoredComment;
}