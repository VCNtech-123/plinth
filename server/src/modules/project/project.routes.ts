import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createProject, getProjectById, getProjects, updateProject, deleteProject, restoreProject } from './project.controller';
import { createProjectSchema, getProjectsSchema, getProjectByIdSchema, updateProjectSchema, deleteProjectSchema, restoreProjectSchema } from './project.validation';
import { validate } from '../../middleware/validate.middleware';
import { attachWorkspace } from '../../middleware/workspace.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

router.use(protect, attachWorkspace)
router.post("/", validate(createProjectSchema), authorize("owner", "admin", "member"), createProject);
router.get("/", validate(getProjectsSchema), getProjects);
router.get("/:id", validate(getProjectByIdSchema), getProjectById);
router.put("/:id", validate(updateProjectSchema), authorize("owner", "admin"), updateProject);
router.delete("/:id", validate(deleteProjectSchema), authorize("owner"), deleteProject);
router.patch("/:id/restore", validate(restoreProjectSchema), authorize("owner"), restoreProject);

export default router;


