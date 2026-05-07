import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16: Renamed from middleware.ts to proxy.ts
const { auth } = NextAuth(authConfig);

// Exporting as default to ensure Next.js 16 recognizes it correctly
export default auth;
