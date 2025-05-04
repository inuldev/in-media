import { NextRequest, NextResponse } from "next/server";
import { hash } from "@node-rs/argon2";
import { generateId } from "lucia";

import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signUpSchema.parse(body);
    const { username, email, password } = validatedData;

    // Periksa apakah username sudah digunakan
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Nama pengguna sudah digunakan" },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah digunakan
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, {
      memoryCost: 12288,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Buat user baru
    const userId = generateId(15);
    const user = await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        name: username,
        email,
        passwordHash,
      },
    });

    return NextResponse.json(
      { success: true, message: "Pendaftaran berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
