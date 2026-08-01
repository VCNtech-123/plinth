import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createTaskSchema, getTasksSchema, getTaskByIdSchema, updateTaskSchema, deleteTaskSchema, restoreTaskSchema } from './task.validation';
import { createTask, getTasks, getTaskById, updateTaskById, deleteTask, restoreTask } from './task.controller';
import { validate } from '../../middleware/validate.middleware';

const router = Router();

router.post("/", protect, validate(createTaskSchema), createTask );
router.get("/", protect, validate(getTasksSchema), getTasks);
router.get("/:id", protect, validate(getTaskByIdSchema), getTaskById);
router.put("/:id", protect, validate(updateTaskSchema), updateTaskById);
router.delete("/:id", protect, validate(deleteTaskSchema), deleteTask);
router.patch("/:id/restore", protect, validate(restoreTaskSchema), restoreTask)

export default router;