// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      username: string;
      role: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string;
    email: string;
    username: string;
    role: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    username: string;
    role: string;
    accessToken?: string;
  }
}
