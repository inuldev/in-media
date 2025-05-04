import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Tambahkan logging untuk debugging
  console.log("Middleware running for path:", request.nextUrl.pathname);

  // Jangan periksa token untuk halaman login dan signup
  if (
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    console.log("Skipping auth check for auth-related path");
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("Auth token:", token ? "exists" : "missing");

    // Jika pengguna tidak terautentikasi, redirect ke halaman login
    if (!token) {
      console.log("No token, redirecting to login");
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    console.log("User authenticated, proceeding");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Jika terjadi error, biarkan request lanjut untuk menghindari loop redirect
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
