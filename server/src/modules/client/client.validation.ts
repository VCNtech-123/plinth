import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError";
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

export const createClientSchema = z.object({
  body: createClientBodySchema,
});

export const getClientByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const getClientsSchema = z.object({
  query: z.object({
    page: z
      .coerce
      .number()
      .int()
      .min(1, "Page must be at least 1")
      .optional(),

    limit: z
      .coerce
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .optional(),

    skip: z
      .coerce
      .number()
      .int()
      .min(0, "Skip cannot be negative")
      .optional(),

    search: z
      .string()
      .trim()
      .min(1)
      .optional(),

    status: z
      .enum(["active", "inactive"])
      .optional(),
  }).strict(),
});