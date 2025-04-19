import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import type { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          }
        })
        if (!user) return null;

        const isValid = await argon2.verify(user.password, credentials.password);
        if (!isValid) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          branch: user.branch ?? undefined,
        };
      },
    })
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = Number(user?.id)
        session.user.role = user.role;
        session.user.branch = user.branch;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
}