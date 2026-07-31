import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createProject, getProjectById, getProjects, updateProject, deleteProject, restoreProject } from './project.controller';
import { createProjectSchema, getProjectsSchema, getProjectByIdSchema, updateProjectSchema, deleteProjectSchema, restoreProjectSchema } from './project.validation';
import { validate } from '../../middleware/validate.middleware';


const router = Router();

router.post("/", protect, validate(createProjectSchema), createProject);
router.get("/", protect, validate(getProjectsSchema), getProjects);
router.get("/:id", protect, validate(getProjectByIdSchema), getProjectById);
router.put("/:id", protect, validate(updateProjectSchema), updateProject);
router.delete("/:id", protect, validate(deleteProjectSchema), deleteProject);
router.patch("/:id/restore", protect, validate(restoreProjectSchema), restoreProject);

export default router;


