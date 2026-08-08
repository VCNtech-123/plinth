
import { Comment } from "./comment.model";
import mongoose from "mongoose";
import { getTaskByIdService } from '../task/task.service'
import { CommentBody } from "./comment.validation";

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
