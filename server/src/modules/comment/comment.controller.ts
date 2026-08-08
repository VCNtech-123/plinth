import { Request, Response } from "express";
import { createCommentService } from "./comment.service";
import { CommentBody } from "./comment.validation";
import { ApiError } from "../../utils/ApiError";

export const createComment = async (
    req: Request,
    res: Response
) => {

    const { body } = res.locals.validated as {
        body: CommentBody
    };

    const comment = await createCommentService(
        req.params.id,
        req.user!._id,
        body
    )

    if (!comment) {
        throw new ApiError(404, 'Task not found')
    }

    res.status(201).json({
        status: "success",
        data: {
            id: comment._id,
            content: comment.content,
            task: comment.task,
            author: comment.author,
            owner: comment.owner,
            createdAt: comment.createdAt
        },
    });
}