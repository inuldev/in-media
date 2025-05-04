import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Menambahkan properti kustom ke session.user
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * Menambahkan properti kustom ke user
   */
  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Menambahkan properti kustom ke JWT
   */
  interface JWT {
    id?: string;
  }
}
