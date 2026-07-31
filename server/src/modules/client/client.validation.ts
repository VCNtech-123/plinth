
import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

const createClientBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
}).strict();  

export const getClientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type GetClientsQuery = z.infer<typeof getClientsQuerySchema>;

export const createClientSchema = z.object({
  body: createClientBodySchema,
});

export const getClientsSchema = z.object({
  query: getClientsQuerySchema.strict(),
});

export const getClientByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const updateClientSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: createClientBodySchema.partial().strict(),
});

export const deleteClientSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});