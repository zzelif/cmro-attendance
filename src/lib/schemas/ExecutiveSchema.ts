// src\lib\schemas\ExecutiveSchema.ts
import { z } from "zod";

export const executiveSchema = z.object({
  fullName: z.string().min(5, "Full name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  temporaryPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
  type: z.string().min(5, "Type is required"),
});

export type ExecutiveSchema = z.infer<typeof executiveSchema>;
