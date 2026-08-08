
import { Comment } from "./comment.model";
import mongoose from "mongoose";
import { getTaskByIdService } from '../task/task.service'
import { CommentBody } from "./comment.validation";

export const createCommentService = async (
    taskId: string | string[],
    userId: mongoose.Types.ObjectId,
    data: CommentBody
) => {
    
    taskId = Array.isArray(taskId) ? taskId[0] : taskId;
    const existingTask = await getTaskByIdService(taskId, userId);

    if (!existingTask) {
        return null
    }


    const comment = await Comment.create({
        owner: userId,
        task: taskId,
        ...data
    });

    return comment;
}
