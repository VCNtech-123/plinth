import { z } from "zod";

export const emptySchema = z.object({
  body: z.object({}).strict().optional(),
  query: z.object({}).strict().optional(),
  params: z.object({}).strict().optional(),
});