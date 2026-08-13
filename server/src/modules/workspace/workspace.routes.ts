
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, inviteUser, 
         getInvites, acceptInvite, getUserWorkspaces, declineInvite, 
         setCurrentWorkspace, removeMember, updateWorkspace,
         leaveWorkspace } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { inviteMemberSchema, acceptInviteSchema, declineInviteSchema, 
         setCurrentWorkplaceSchema, removeMemberSchema, updateWorkspaceSchema } from "./workspace.validation";
import { emptySchema } from "../../utils/empty";
import { authorize } from "../../middleware/authorize.middleware";


const router = Router()

router.get("/me/invites", protect, validate(emptySchema), getInvites);
router.patch("/me/invites/:id/accept", protect, validate(acceptInviteSchema), acceptInvite)
router.patch("/me/invites/:id/decline", protect, validate(declineInviteSchema), declineInvite)

router.get("/", protect, validate(emptySchema), getUserWorkspaces)
router.patch("/me/switch", protect, validate(setCurrentWorkplaceSchema), setCurrentWorkspace)

router.use(protect, attachWorkspace)

router.get("/me", validate(emptySchema), getCurrentWorkspace);
router.patch("/me", validate(updateWorkspaceSchema), authorize("owner", "admin"), updateWorkspace);
router.post("/me/leave", validate(emptySchema), leaveWorkspace)
router.get("/me/members", validate(emptySchema), getWorkspaceMembers);
router.post("/me/members", validate(inviteMemberSchema), authorize("owner", "admin"), inviteUser);
router.delete("/me/members/:id", validate(removeMemberSchema), authorize("owner"), removeMember);




export default router;
