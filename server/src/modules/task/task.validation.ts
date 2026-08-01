import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

export const getTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z
    .enum(["low", "medium", "high"])
    .optional(),
  project: objectIdSchema.optional(),
}).strict();

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

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

export const getTasksSchema = z.object({
  query: getTasksQuerySchema,
});
