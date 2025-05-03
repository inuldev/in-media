"use server";

import { cookies } from "next/headers";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { signUpSchema, SignUpValues } from "@/lib/validation";

export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    let validatedData;
    try {
      validatedData = signUpSchema.parse(credentials);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return {
        error: "Data tidak valid. Pastikan semua field diisi dengan benar.",
      };
    }

    const { username, email, password } = validatedData;

    let passwordHash;
    try {
      passwordHash = await hash(password, {
        memoryCost: 12288, // Mengurangi memory cost untuk menghindari error di lingkungan terbatas
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return {
        error: "Gagal memproses kata sandi. Silakan coba lagi.",
      };
    }

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Nama pengguna sudah digunakan",
      };
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email sudah digunakan",
      };
    }

    // Pisahkan transaksi database dari operasi Stream Chat
    try {
      await prisma.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return {
        error: "Gagal membuat akun. Silakan coba lagi nanti.",
      };
    }

    // Coba upsert user ke Stream Chat, tapi jangan biarkan error menggagalkan pendaftaran
    try {
      await streamServerClient.upsertUser({
        id: userId,
        username,
        name: username,
      });
    } catch (streamError) {
      console.error("Stream Chat error:", streamError);
      // Lanjutkan proses meskipun ada error dari Stream Chat
    }

    try {
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return redirect("/");
    } catch (sessionError) {
      console.error("Session creation error:", sessionError);
      // Jika gagal membuat sesi, kembalikan pesan error yang lebih spesifik
      return {
        error:
          "Pendaftaran berhasil tetapi gagal masuk otomatis. Silakan coba masuk secara manual.",
      };
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;

    // Log error dengan detail lebih lengkap
    console.error("Signup error:", error);

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
        error.message.includes("hash") ||
        error.message.includes("argon2")
      ) {
        errorMessage =
          "Terjadi kesalahan saat memproses kata sandi. Silakan coba kata sandi yang berbeda.";
      } else if (
        error.message.includes("stream") ||
        error.message.includes("chat")
      ) {
        errorMessage =
          "Terjadi kesalahan pada layanan chat. Akun Anda tetap dibuat, silakan coba masuk.";
      }
    }

    return {
      error: errorMessage,
    };
  }
}
