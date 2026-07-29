import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const formatted = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        new ApiError(
          400,
          formatted[0]?.message || "Invalid request data"
        )
      );
    }

    // Explicitly type result.data so TypeScript knows body/params/query exist
    const data = result.data as Record<string, any>;

    req.body = data.body ?? req.body;
    req.params = data.params ?? req.params;
    req.query = data.query ?? req.query;

    next();
  };