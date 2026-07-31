import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';
import mongoose from 'mongoose';
import { z } from 'zod'
import { objectIdSchema } from '../../utils/objectId';

export const validateCreateProject = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, client } = req.body || { };

    if (!name || !client ) {    
        throw new ApiError(400, 'Name and client are requred')
    } 

    if (!mongoose.Types.ObjectId.isValid(client)) {
        throw new ApiError(400, 'InvalidClientId');
    }

    next();
}

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

export const createProjectSchema = z.object({
  body: projectBodySchema,
});