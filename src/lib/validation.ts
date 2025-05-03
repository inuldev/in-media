import { z } from "zod";

const requiredString = z.string().trim().min(1, "Wajib diisi");

export const signUpSchema = z.object({
  email: requiredString.email("Alamat email tidak valid"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Hanya huruf, angka, - dan _ yang diperbolehkan",
  ),
  password: requiredString.min(8, "Minimal 8 karakter"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Tidak boleh lebih dari 5 lampiran"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Maksimal 1000 karakter"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const createCommentSchema = z.object({
  content: requiredString,
});
