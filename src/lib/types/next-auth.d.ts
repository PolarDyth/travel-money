import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      role: "ADMIN" | "OPERATOR" | "MANAGER" | "AUDITOR";
      branch?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    role: "ADMIN" | "OPERATOR" | "MANAGER" | "AUDITOR";
    branch?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: "ADMIN" | "OPERATOR";
    branch?: string;
  }
}
