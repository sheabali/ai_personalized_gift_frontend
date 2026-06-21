import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { CloudCog } from "lucide-react";

// ============================================
// Protected Routes Configuration
// ============================================
const authRoutes = ["/login", "/register", "/forgot-password"];
const protectedRoutes = ["/admin", "/user", "/orders"];
const adminOnlyRoutes = ["/admin"];

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. Redirect authenticated users away from auth pages (login/register)
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Redirect unauthenticated users away from protected pages
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CloudCog
  // 3. Admin-only route guard
  if (token && adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)",
  ],
};
