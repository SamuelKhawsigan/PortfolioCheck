import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          
          // Use Prisma here (only runs on Server, not Edge)
          const user = await prisma.admin.findUnique({
            where: { username },
          });

          if (!user) return null;

          // Use Bcrypt here
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) return { id: user.id, name: user.username };
        }

        return null;
      },
    }),
  ],
});
