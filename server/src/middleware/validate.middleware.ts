import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

type RequestSchema = z.ZodObject<{
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
}>;

export const validate =
 (schema: RequestSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
    const firstError = result.error.issues[0];
    const fieldPath = firstError.path.join(".");
    const errorMessage = fieldPath 
      ? `${fieldPath}: ${firstError.message}` 
      : firstError.message;

    return next(
      new ApiError(
        400,
        errorMessage ?? "Invalid request data"
      )
    );
  }

    res.locals.validated = result.data;

    next();
  };