
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { attachWorkspace } from "../../middleware/workspace.middleware";
import { getCurrentWorkspace, getWorkspaceMembers, inviteUser, getInvites, acceptInvite, getUserWorkspaces } from "./workspace.controller";
import { validate } from "../../middleware/validate.middleware";
import { addWorkspaceMemberSchema, acceptInviteSchema } from "./workspace.validation";
import { authorize } from "../../middleware/authorize.middleware";


const router = Router()

router.patch("/me/invites/:id/accept", protect, validate(acceptInviteSchema), acceptInvite)
router.use(protect, attachWorkspace)
router.get("/", getUserWorkspaces)
router.get("/me", getCurrentWorkspace);
router.get("/me/members", getWorkspaceMembers);
router.post("/me/members", validate(addWorkspaceMemberSchema), authorize("admin", "admin"), inviteUser);
router.get("/me/invites", getInvites);


export default router;
