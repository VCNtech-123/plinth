import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ACTUAL RUNTIME ERROR CAUGHT:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    errorDetails: err.message || err, 
    stack: err.stack // This will point directly to the broken line number!
  });
};
