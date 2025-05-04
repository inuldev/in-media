import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { generateId } from "lucia";

import prisma from "@/lib/prisma";
import { signUpSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    // Log untuk debugging
    console.log("Register API called");

    let body;
    try {
      body = await req.json();
      console.log("Request body parsed:", { ...body, password: "[REDACTED]" });
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    let validatedData;
    try {
      validatedData = signUpSchema.parse(body);
    } catch (error) {
      console.error("Validation error:", error);
      return NextResponse.json(
        { error: "Data tidak valid. Pastikan semua field diisi dengan benar." },
        { status: 400 },
      );
    }

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
        { status: 400 },
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
        { status: 400 },
      );
    }

    // Hash password dengan bcrypt (10 rounds adalah standar yang aman)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Buat user baru
    let user;
    try {
      const userId = generateId(15);
      user = await prisma.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          name: username,
          email,
          passwordHash,
        },
      });

      console.log("User created successfully:", {
        id: user.id,
        username: user.username,
      });

      return NextResponse.json(
        { success: true, message: "Pendaftaran berhasil", userId: user.id },
        { status: 201 },
      );
    } catch (dbError) {
      console.error("Database error during user creation:", dbError);
      return NextResponse.json(
        { error: "Gagal membuat akun. Silakan coba lagi nanti." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 },
    );
  }
}
