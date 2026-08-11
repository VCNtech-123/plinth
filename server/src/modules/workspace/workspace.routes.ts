
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, addWorkspaceMember } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { addWorkspaceMemberSchema } from "./workspace.validation";

const router = Router()

router.use(protect, attachWorkspace)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);
router.post("/me/members", validate(addWorkspaceMemberSchema), addWorkspaceMember)

export default router;
