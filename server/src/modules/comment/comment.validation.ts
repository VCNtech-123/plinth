import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

const commentBodySchema = z.object({
    content: z.string().trim().min(1, "Please enter a comment"),
});

const getCommentsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>;
export type CommentBody = z.infer<typeof commentBodySchema>;

export const createCommentSchema = z.object({
    params: z.object({
        taskId: objectIdSchema
    }),
    body: commentBodySchema.strict()
});

export const getCommentsSchema = z.object({
    params: z.object({
        id: objectIdSchema
    }),
    query: getCommentsQuerySchema
});

export const deleteCommentSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export const restoreCommentSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});



