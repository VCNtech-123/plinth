
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/:taskId/comments", protect);
router.get("/:taskId/comments", protect);
router.delete("/comments/:id", protect);
router.patch("/comments/:id/restore", protect);

export default router;