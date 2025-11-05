// lib/schemas/auth.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
