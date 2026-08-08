
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { createComment } from "./comment.controller";
import { validate } from "../../middleware/validate.middleware";
import { createCommentSchema } from "./comment.validation";

const router = Router();

router.post("/:taskId/comments", protect, validate(createCommentSchema), createComment);
router.get("/:taskId/comments", protect);
router.delete("/comments/:id", protect);
router.patch("/comments/:id/restore", protect);

export default router;