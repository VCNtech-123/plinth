import { Request, Response } from "express";
import { createCommentService, getCommentsByTaskIdService, deleteCommentService, restoreCommentService } from "./comment.service";
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
            author: {
                id: comment.author._id,
                name: comment.author.name,
                email: comment.author.email
            },
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

    const result = await getCommentsByTaskIdService(
        taskId,
        req.user!._id,
        query
    )

    if (!result) {
        throw new ApiError(404, "Task not found");
    }

    const { comments, results } = result

    res.status(200).json({
        status: "success",
        results: results,
        data: comments.map((comment) => ({
            id: comment._id,
            content: comment.content,
            author: {
                id: comment.author._id,
                name: comment.author.name,
                email: comment.author.email
            },
            createdAt: comment.createdAt
        }))
    });
}

export const deleteComment = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    const deletedComment = await deleteCommentService(
        id,
        req.user!._id
    )

    if (!deletedComment) {
        throw new ApiError(404, "No comment found");
    }

    res.status(200).json({
        status: "success",
        data: {
            id: deletedComment._id,
            content: deletedComment.content,
            author: {
                id: deletedComment.author._id,
                name: deletedComment.author.name,
                email: deletedComment.author.email
            },
            createdAt: deletedComment.createdAt
        }
    })
}

export const restoreComment = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    const restoredComment = await restoreCommentService(
        id,
        req.user!._id
    )

    if (!restoredComment) {
        throw new ApiError(404, "No comment found");
    }

    res.status(200).json({
        status: "success",
        data: {
            id: restoredComment._id,
            content: restoredComment.content,
            author: {
                id: restoredComment.author._id,
                name: restoredComment.author.name,
                email: restoredComment.author.email
            },
            createdAt: restoredComment.createdAt
        }
    })
}