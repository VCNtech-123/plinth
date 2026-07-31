
import { z } from 'zod'
import { objectIdSchema } from '../../utils/objectId';

export const getProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["active", "completed", "paused"]).optional(),
  clientId: objectIdSchema.optional()
});

const projectBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required"),

  description: z
    .string()
    .trim()
    .optional(),

  status: z
    .enum(["active", "completed", "paused"])
    .optional(),

  deadline: z
    .coerce
    .date()
    .optional(),

  budget: z
    .coerce
    .number()
    .min(0, "Budget cannot be negative")
    .optional(),

  client: objectIdSchema,
}).strict();

export type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;
export type UpdateProjectData = z.infer<typeof projectBodySchema>

export const createProjectSchema = z.object({
  body: projectBodySchema,
});


export const getProjectsSchema = z.object({
    query: getProjectsQuerySchema
});

export const getProjectByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

export const updateProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    body: projectBodySchema.partial().strict()
  })
});

export const deleteProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

export const restoreProjectSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})


