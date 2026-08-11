
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers } from "./workspace.controller";

const router = Router()

router.use(protect, attachWorkspace)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);

export default router;
