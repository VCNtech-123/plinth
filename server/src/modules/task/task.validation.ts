import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

export const getTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  search: z.string().optional(),
  priority: z
    .enum(["low", "medium", "high"])
    .optional(),
  project: objectIdSchema.optional(),
}).strict();


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
  assignee: objectIdSchema.optional()
}).strict();

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;
export type TaskBody = z.infer<typeof taskBodySchema>

export const createTaskSchema = z.object({
    body: taskBodySchema
});

export const getTasksSchema = z.object({
  query: getTasksQuerySchema,
});

export const getTaskByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: taskBodySchema.partial().strict()
});


export const deleteTaskSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const restoreTaskSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})