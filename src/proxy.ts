import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16: This file is "proxy.ts" (renamed from "middleware.ts").
// We only import the Edge-safe config here to avoid loading Prisma/Bcrypt
// in the Edge/Node proxy runtime.
export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  // Apply to all routes except static assets and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
