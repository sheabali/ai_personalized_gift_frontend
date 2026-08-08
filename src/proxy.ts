import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const authRoutes = ["/login", "/register", "/forgot-password"];
const protectedRoutes = ["/admin", "/user", "/orders"];
const adminOnlyRoutes = ["/admin"];

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured in frontend environment.");
    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(jwtSecret);
  let decodedPayload: DecodedToken | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      decodedPayload = payload as unknown as DecodedToken;
    } catch (error) {
      console.warn("JWT Verification failed:", error);
      // If token is invalid/expired, remove it and redirect to login if accessing protected routes
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  // Redirect authenticated users away from auth pages (login/register)
  if (decodedPayload && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!decodedPayload && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  // Admin-only route guard
  if (decodedPayload && adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
    if (decodedPayload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/orders/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
