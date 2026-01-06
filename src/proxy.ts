import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/edgeTokenUtils";

const publicRoutes = ["/login", "/register"];
const protectedRoutes = ["/", "/splitHouse", "/colours", "/results"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // Check if user has valid auth token
  const authToken = request.cookies.get("authToken")?.value;
  const jwtSecret = process.env.NEXTAUTH_SECRET || "your-secret-key";

  // Verify the token is valid (not just present)
  let isValidToken = false;
  if (authToken) {
    const decoded = await verifyTokenEdge(authToken, jwtSecret);
    isValidToken = decoded !== null;
  }

  // If trying to access protected route without valid auth, redirect to login
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register, redirect to home
  if (isPublicRoute && isValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
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
