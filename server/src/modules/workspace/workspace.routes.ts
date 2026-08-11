
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace } from "./workspace.controller";

const router = Router()

router.use(protect, attachWorkspace)
router.get("/me", getCurrentWorkspace)

export default router;
