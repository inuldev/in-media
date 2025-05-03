"use server";

import { cookies } from "next/headers";
import { verify } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";

export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Nama pengguna atau kata sandi salah",
      };
    }

    let validPassword = false;
    try {
      validPassword = await verify(existingUser.passwordHash, password, {
        memoryCost: 12288, // Mengurangi memory cost untuk menghindari error di lingkungan terbatas
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
    } catch (verifyError) {
      console.error("Password verification error:", verifyError);
      return {
        error: "Gagal memverifikasi kata sandi. Silakan coba lagi.",
      };
    }

    if (!validPassword) {
      return {
        error: "Nama pengguna atau kata sandi salah",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // Log error dengan detail lebih lengkap
    console.error("Login error:", error);

    // Berikan pesan error yang lebih spesifik jika memungkinkan
    let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";

    if (error instanceof Error) {
      // Tambahkan informasi error untuk debugging
      console.error(`Error name: ${error.name}, message: ${error.message}`);

      // Berikan pesan yang lebih spesifik berdasarkan jenis error
      if (
        error.message.includes("database") ||
        error.message.includes("prisma")
      ) {
        errorMessage = "Terjadi kesalahan database. Silakan coba lagi nanti.";
      } else if (
        error.message.includes("verify") ||
        error.message.includes("argon2")
      ) {
        errorMessage =
          "Terjadi kesalahan saat memverifikasi kata sandi. Silakan coba lagi.";
      } else if (
        error.message.includes("parse") ||
        error.message.includes("validation")
      ) {
        errorMessage =
          "Data tidak valid. Pastikan semua field diisi dengan benar.";
      }
    }

    return {
      error: errorMessage,
    };
  }
}
