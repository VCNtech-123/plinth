import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/ApiError";
import { z } from "zod";
import { objectIdSchema } from "../../utils/objectId";

export const validateCreateClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    throw new ApiError(400, "Name and email are required");
  }

  next();
};

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