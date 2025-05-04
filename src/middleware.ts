import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware sederhana untuk memeriksa autentikasi
export function middleware(request: NextRequest) {
  // Daftar path yang tidak memerlukan autentikasi
  const publicPaths = [
    "/login",
    "/signup",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];

  // Periksa apakah path saat ini adalah path publik
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  // Jika path publik, izinkan akses
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Periksa apakah ada cookie auth
  const authCookie =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // Jika tidak ada cookie auth, redirect ke login
  if (!authCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Jika ada cookie auth, izinkan akses
  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
