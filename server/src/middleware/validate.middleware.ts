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
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const firstError = result.error.issues[0];

      return next(
        new ApiError(
          400,
          firstError?.message ?? "Invalid request data"
        )
      );
    }

    if (result.data.body) {
      req.body = result.data.body;
    }

    if (result.data.params) {
      req.params = result.data.params as Request["params"];
    }

    if (result.data.query) {
      req.query = result.data.query as Request["query"];
    }

    next();
  };