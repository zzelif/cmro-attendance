// src\proxy.ts

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { protectedRoutes, publicRoutes, authRoutes } from "./routes";
import { getUserRole, getRedirectUrlByRole } from "./lib/helpers";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth state from Supabase middleware
  const { user, response } = await updateSession(request);

  // Classify the route
  const { isPublic, isProtected, isAuth } = getRouteType(pathname);

  // Check if pathname matches any protected route
  if (isPublic) {
    return NextResponse.next();
  }

  // Protected routes - require auth
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Auth route (login) - authenticated users go to dashboard
  if (isAuth && user) {
    const role = getUserRole(user);
    const dashboardUrl = getRedirectUrlByRole(role);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Default - allow request
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};

/**
 * Route type checker
 */
function getRouteType(pathname: string) {
  return {
    isPublic: publicRoutes.includes(pathname),
    isProtected: protectedRoutes.some((route) => pathname.startsWith(route)),
    isAuth: authRoutes.includes(pathname),
  };
}
