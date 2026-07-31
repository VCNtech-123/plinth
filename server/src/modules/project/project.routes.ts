import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createProject, getProjectById, getProjects, updateProject, deleteProject, restoreProject } from './project.controller';
import { createProjectSchema, getProjectSchema } from './project.validation';
import { validate } from '../../middleware/validate.middleware';


const router = Router();

router.post("/", protect, validate(createProjectSchema), createProject);
router.get("/", protect, validate(getProjectSchema), getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:id/restore", protect, restoreProject)

export default router;


