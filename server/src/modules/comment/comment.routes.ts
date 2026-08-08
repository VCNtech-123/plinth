
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createComment, getCommentsByTaskId, deleteComment, restoreComment } from "./comment.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCommentSchema, getCommentsSchema, deleteCommentSchema, restoreCommentSchema } from "./comment.validation";

const router = Router();

router.post("/tasks/:taskId/comments", protect, validate(createCommentSchema), createComment);
router.get("/tasks/:taskId/comments", protect, validate(getCommentsSchema), getCommentsByTaskId);
router.delete("/comments/:id", protect, validate(deleteCommentSchema), deleteComment);
router.patch("/comments/:id/restore", protect, validate(restoreCommentSchema), restoreComment);

export default router;