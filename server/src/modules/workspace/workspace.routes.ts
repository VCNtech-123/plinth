
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, inviteUser, getInvites, acceptInvite } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { addWorkspaceMemberSchema, acceptInviteSchema } from "./workspace.validation";


const router = Router()

router.patch("/me/invites/:id/accept", protect, validate(acceptInviteSchema), acceptInvite)
router.use(protect, attachWorkspace)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);
router.post("/me/members", validate(addWorkspaceMemberSchema), inviteUser);
router.get("/me/invites", getInvites);

export default router;
