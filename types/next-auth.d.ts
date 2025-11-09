// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      username: string; // Removed optional
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string;
    email: string;
    username: string; // Removed optional
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    username: string; // Removed optional
    accessToken?: string;
  }
}
