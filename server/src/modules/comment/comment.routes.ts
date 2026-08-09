
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createComment, getCommentsByTaskId, deleteComment, restoreComment } from "./comment.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCommentSchema, getCommentsSchema, deleteCommentSchema, restoreCommentSchema } from "./comment.validation";
import { attachWorkspace } from "../../middleware/workspace.middleware";

const router = Router();

router.use(protect, attachWorkspace)
router.post("/tasks/:taskId/comments", validate(createCommentSchema), createComment);
router.get("/tasks/:taskId/comments", validate(getCommentsSchema), getCommentsByTaskId);
router.delete("/comments/:id", validate(deleteCommentSchema), deleteComment);
router.patch("/comments/:id/restore", validate(restoreCommentSchema), restoreComment);

export default router;