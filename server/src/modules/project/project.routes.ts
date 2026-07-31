import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createProject, getProjectById, getProjects, updateProject, deleteProject, restoreProject } from './project.controller';
import { createProjectSchema, getProjectSchema, getProjectByIdSchema, updateClientSchema } from './project.validation';
import { validate } from '../../middleware/validate.middleware';


const router = Router();

router.post("/", protect, validate(createProjectSchema), createProject);
router.get("/", protect, validate(getProjectSchema), getProjects);
router.get("/:id", protect, validate(getProjectByIdSchema), getProjectById);
router.put("/:id", protect, validate(updateClientSchema), updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:id/restore", protect, restoreProject)

export default router;


