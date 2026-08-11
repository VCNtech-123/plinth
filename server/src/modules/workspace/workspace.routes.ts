
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";

const router = Router()

router.use(protect, attachWorkspace)
router.get("/me")

export default router;
