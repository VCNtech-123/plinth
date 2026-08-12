
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createComment, getCommentsByTaskId, deleteComment, restoreComment } from "./comment.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCommentSchema, getCommentsSchema, deleteCommentSchema, restoreCommentSchema } from "./comment.validation";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { authorize } from "../../middleware/authorize.middleware";

const router = Router();

router.use(protect, attachWorkspace)
router.post("/tasks/:taskId/comments", validate(createCommentSchema), authorize("owner", "admin", "member"), createComment);
router.get("/tasks/:taskId/comments", validate(getCommentsSchema), getCommentsByTaskId);
router.delete("/comments/:id", validate(deleteCommentSchema), authorize("owner"), deleteComment);
router.patch("/comments/:id/restore", validate(restoreCommentSchema), authorize("owner"), restoreComment);

export default router;