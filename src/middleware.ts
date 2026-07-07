import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getAuthConfig } from "@/lib/auth.config";

// Instancia separada y ligera de NextAuth solo para el middleware (Edge Runtime):
// evita que Prisma/bcrypt (usados en la config completa de lib/auth.ts) se
// empaqueten en la Edge Function, que en Vercel Hobby tiene un límite de 1MB.
const { auth } = NextAuth(getAuthConfig());

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);

  if (pathname.startsWith("/admin") && !isPublicPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
