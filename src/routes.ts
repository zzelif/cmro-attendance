// src/routes.ts
/**
 * Array of routes that require authentication
 * Middleware will redirect to /login if user is not authenticated
 */
export const protectedRoutes = ["/member", "/admin", "/super"];

/**
 * Array of authentication routes
 * If user is already logged in, they'll be redirected to dashboard
 */
export const authRoutes = ["/login"];

/**
 * Public routes that don't require authentication
 * These routes are accessible to everyone
 */
export const publicRoutes = ["/"];
