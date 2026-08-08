
import { Router } from "express";

const router = Router();

router.post("/:taskId/comments");
router.get("/:taskId/comments");
router.delete("/comments/:id");
router.patch("/comments/:id/restore");

export default router;