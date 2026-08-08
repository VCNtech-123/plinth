import { Request, Response } from "express";
import { createCommentService, getCommentsByTaskIdService } from "./comment.service";
import { CommentBody, GetCommentsQuery } from "./comment.validation";
import { ApiError } from "../../utils/ApiError";

export const createComment = async (
    req: Request,
    res: Response
) => {

    const taskId = req.params.taskId as string
    const { body } = res.locals.validated as {
        body: CommentBody
    };

    const comment = await createCommentService(
        taskId,
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

export const getCommentsByTaskId = async (
    req: Request,
    res: Response
) => {

    const taskId = req.params.taskId as string;
    const { query } = res.locals.validated as {
        query: GetCommentsQuery
    }

    const comments = await getCommentsByTaskIdService(
        taskId,
        req.user!._id,
        query
    )

    if (!comments) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
        status: "success",
        data: comments.map((comment) => ({
            id: comment._id,
            content: comment.content,
            task: comment.task,
            author: {
                name: comment.author.name,
                email: comment.author.email
            },
            owner: comment.owner,
            createdAt: comment.createdAt
        }))
    });

    
}