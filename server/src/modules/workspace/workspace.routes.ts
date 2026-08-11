
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, addWorkspaceMember, getInvites, acceptInvite } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { addWorkspaceMemberSchema, acceptInviteSchema } from "./workspace.validation";

const router = Router()

router.use(protect, attachWorkspace)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);
router.get("/me/invites", getInvites);
router.post("/me/members", validate(addWorkspaceMemberSchema), addWorkspaceMember);
router.patch("/me/:id/accept-invite", validate(acceptInviteSchema), acceptInvite)


export default router;
