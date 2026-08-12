
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, inviteUser, getInvites, acceptInvite, getUserWorkspaces, declineInvite } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { inviteMemberSchema, acceptInviteSchema, declineInviteSchema } from "./workspace.validation";
import { emptySchema } from "../../utils/empty";
import { authorize } from "../../middleware/authorize.middleware";


const router = Router()

router.get("/me/invites", protect, validate(emptySchema), getInvites);
router.patch("/me/invites/:id/accept", protect, validate(acceptInviteSchema), acceptInvite)
router.patch("/me/invites/:id/decline", protect, validate(declineInviteSchema), declineInvite)

router.get("/", protect, validate(emptySchema), getUserWorkspaces)

router.use(protect, attachWorkspace)

router.get("/me", validate(emptySchema), getCurrentWorkspace);
router.get("/me/members", validate(emptySchema), getWorkspaceMembers);
router.post("/me/members", validate(inviteMemberSchema), authorize("owner", "admin"), inviteUser);



export default router;
