import { z } from "zod";

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters long")
  .max(128, "Password is too long")
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must include at least one lowercase letter"
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must include at least one uppercase letter"
  )
  .refine(
    (password) => /\d/.test(password),
    "Password must include at least one number"
  );

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ error: "Invalid email address" })),

    password: passwordSchema,
  }).strict(),
});