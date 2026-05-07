import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// By using the authConfig here, we avoid importing Prisma/Bcrypt into the Edge runtime.
export default NextAuth(authConfig).auth;

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
