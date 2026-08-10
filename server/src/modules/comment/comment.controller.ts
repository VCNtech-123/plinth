import { Request, Response } from "express";
import { createCommentService, getCommentsByTaskIdService, deleteCommentService, restoreCommentService } from "./comment.service";
import { CommentBody, GetCommentsQuery } from "./comment.validation";
import { ApiError } from "../../utils/ApiError";
import { PopulatedComment } from "../../types/comment.types";

const formatComment = (comment: PopulatedComment) => ({
  id: comment._id,
  content: comment.content,
  author: {
    id: comment.author._id,
    name: comment.author.name,
    email: comment.author.email,
  },
  createdAt: comment.createdAt,
});


export const createComment = async (
    req: Request,
    res: Response
) => {

    const taskId = req.params.taskId as string
    const { body } = res.locals.validated as {
        body: CommentBody,
    };

    const comment = await createCommentService(
        taskId,
        req.user!._id,
        req.workspace!._id,
        body
    )

    if (!comment) {
        throw new ApiError(404, 'Task not found')
    }

    res.status(201).json({
        status: "success",
        data: formatComment(comment)
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
        req.workspace!._id,
        query
    )

    if (!result) {
        throw new ApiError(404, "Task not found");
    }

    const { comments, results } = result

    res.status(200).json({
        status: "success",
        results: results,
        data: comments.map(formatComment)
    });
}

export const deleteComment = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    const deletedComment = await deleteCommentService(
        id,
        req.workspace!._id
    )

    if (!deletedComment) {
        throw new ApiError(404, "No comment found");
    }

    res.status(200).json({
        status: "success",
        data: formatComment(deletedComment)
    })
}

export const restoreComment = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    const restoredComment = await restoreCommentService(
        id,
        req.workspace!._id
    )

    if (!restoredComment) {
        throw new ApiError(404, "No comment found");
    }

    res.status(200).json({
        status: "success",
        data: formatComment(restoredComment)
    })
}