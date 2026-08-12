import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { createTaskSchema, getTasksSchema, getTaskByIdSchema, updateTaskSchema, deleteTaskSchema, restoreTaskSchema } from './task.validation';
import { createTask, getTasks, getTaskById, updateTaskById, deleteTask, restoreTask } from './task.controller';
import { validate } from '../../middleware/validate.middleware';
import { attachWorkspace } from '../../middleware/workspace.middleware';
import { authorize } from '../../middleware/authorize.middleware';

const router = Router();

router.use(protect, attachWorkspace)
router.post("/", validate(createTaskSchema), authorize("owner", "admin", "member"), createTask );
router.get("/", validate(getTasksSchema), getTasks);
router.get("/:id", validate(getTaskByIdSchema), getTaskById);
router.put("/:id", validate(updateTaskSchema), authorize("owner", "admin"), updateTaskById);
router.delete("/:id", validate(deleteTaskSchema),  authorize("owner"),  deleteTask);
router.patch("/:id/restore", validate(restoreTaskSchema), authorize("owner"), restoreTask)

export default router;