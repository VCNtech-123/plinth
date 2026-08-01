import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createProjectSchema, getTasksSchema, getTaskByIdSchema, updateTaskSchema, deleteTaskSchema } from './task.validation';
import { createTask, getTasks, getTaskById, updateTaskById, deleteTask, restoreTask } from './task.controller';
import { validate } from '../../middleware/validate.middleware';

const router = Router();

router.post("/", protect, validate(createProjectSchema), createTask );
router.get("/", protect, validate(getTasksSchema), getTasks);
router.get("/:id", protect, validate(getTaskByIdSchema), getTaskById);
router.put("/:id", protect, validate(updateTaskSchema), updateTaskById);
router.delete("/:id", protect, validate(deleteTaskSchema), deleteTask);
router.patch("/:id/restore", protect, restoreTask)

export default router;