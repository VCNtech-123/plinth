
import { Comment } from "./comment.model";
import mongoose from "mongoose";
import { getTaskByIdService } from '../task/task.service'
import { CommentBody, GetCommentsQuery } from "./comment.validation";

export const createCommentService = async (
    taskId: string,
    userId: mongoose.Types.ObjectId,
    data: CommentBody
) => {
    
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

    return comment;
}

export const getCommentsService = async (
    taskId: string,
    userId: mongoose.Types.ObjectId,
    query: GetCommentsQuery
) => {

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

    const comments = await Comment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name email")
        .lean()


    return comments;
}