
import { Comment } from "./comment.model";
import mongoose from "mongoose";
import { getTaskByIdService } from '../task/task.service'
import { CommentBody, GetCommentsQuery } from "./comment.validation";
import { GetCommentsResponse, PopulatedComment } from '../../types/comment.types'

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