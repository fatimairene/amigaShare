import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokenUtils";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/", "/splitHouse", "/colours", "/results"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // Check if user has valid auth token
  const authToken = request.cookies.get("authToken")?.value;

  // Verify the token is valid (not just present)
  const isValidToken = authToken ? verifyToken(authToken) !== null : false;

  // If trying to access protected route without valid auth, redirect to login
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register, allow
  if (isPublicRoute && isValidToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
