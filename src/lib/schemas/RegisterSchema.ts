// src\lib\schemas\RegisterSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(5, "Full name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  temporaryPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
  department: z.string().min(2, "Department is required"),
  type: z.string().min(5, "Type is required"),
  role: z.string().min(5, "Role is required"),
  requiredHours: z
    .string()
    .min(2, "Hours is required")
    .max(4, "Paawat naman kayo"),
  startDate: z.date({
    error: "Start date is required",
  }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
