import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// This configuration is "Edge-safe" because it doesn't import Prisma or Bcrypt directly.
export const authConfig = {
  providers: [
    // We leave this empty or with minimal config; 
    // the full implementation will be in auth.ts
    Credentials({}), 
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath = nextUrl.pathname.startsWith("/admin");
      
      if (isAdminPath) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
