// src\lib\helpers.ts
import { type User } from "@supabase/supabase-js";

/**
 * Get user role from JWT metadata
 * Safe in proxy.ts - no database calls
 */
export function getUserRole(user: User | null): string {
  if (!user?.user_metadata?.role) {
    return "member";
  }
  return user.user_metadata.role as string;
}

/**
 * Map role to dashboard route
 */
const ROLE_ROUTES: Record<string, string> = {
  member: "/member",
  admin: "/admin",
  super: "/super",
};

export function getRedirectUrlByRole(role: string): string {
  return ROLE_ROUTES[role] || ROLE_ROUTES.member;
}
