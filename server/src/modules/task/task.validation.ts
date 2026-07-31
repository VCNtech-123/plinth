import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";


const taskBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required"),

  description: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum(["todo", "in-progress", "done"])
    .optional(),

  priority: z
    .enum(["low", "medium", "high"])
    .optional(),

  dueDate: z
    .coerce
    .date()
    .optional(),

  project: objectIdSchema,
}).strict();

export const createProjectSchema = z.object({
    body: taskBodySchema
});