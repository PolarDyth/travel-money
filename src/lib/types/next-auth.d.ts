import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      lastName: string;
      role: "ADMIN" | "OPERATOR" | "MANAGER" | "AUDITOR";
      branch?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    lastName: string;
    role: "ADMIN" | "OPERATOR" | "MANAGER" | "AUDITOR";
    branch?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    lastName: string;
    role: "ADMIN" | "OPERATOR" | "MANAGER" | "AUDITOR";
    branch?: string;
  }
}
