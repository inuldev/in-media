"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  // Gunakan operasi database biasa tanpa Stream Chat
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: validatedValues,
      select: getUserDataSelect(user.id),
    });

    // Coba update Stream Chat jika tersedia, tapi jangan biarkan error menggagalkan operasi
    try {
      await streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
          name: validatedValues.displayName,
        },
      });
    } catch (streamError) {
      console.error("Failed to update Stream Chat user:", streamError);
      // Lanjutkan meskipun ada error
    }

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw new Error("Gagal memperbarui profil. Silakan coba lagi.");
  }
}
