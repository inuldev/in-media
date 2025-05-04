import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Menambahkan properti kustom ke session.user
   */
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  /**
   * Menambahkan properti kustom ke user
   */
  interface User {
    username: string;
  }
}
