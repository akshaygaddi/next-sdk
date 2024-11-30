// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property to the session user
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ensure the user includes an id
  }

  interface JWT {
    id: string; // Add id to the token object
  }
}
