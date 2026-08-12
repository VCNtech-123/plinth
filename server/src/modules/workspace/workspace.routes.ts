
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, inviteUser, getInvites, acceptInvite, getUserWorkspaces, declineInvite } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { InviteMemberSchema, acceptInviteSchema, declineInviteSchema } from "./workspace.validation";
import { authorize } from "../../middleware/authorize.middleware";


const router = Router()

router.patch("/me/invites/:id/accept", protect, validate(acceptInviteSchema), acceptInvite)
router.patch("/me/invites/:id/decline", protect, validate(declineInviteSchema), declineInvite)
router.use(protect, attachWorkspace)
router.get("/", getUserWorkspaces)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);
router.post("/me/members", validate(InviteMemberSchema), authorize("owner", "admin"), inviteUser);
router.get("/me/invites", getInvites);


export default router;
