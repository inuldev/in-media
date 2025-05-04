"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SignUpForm() {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    setIsLoading(true);

    try {
      // Daftarkan pengguna baru
      try {
        console.log("Submitting registration data:", {
          ...values,
          password: "[REDACTED]",
        });

        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Registration response:", data);

        if (!response.ok) {
          setError(data.error || "Terjadi kesalahan saat pendaftaran");
          return;
        }
      } catch (fetchError) {
        console.error("Registration fetch error:", fetchError);
        setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
        return;
      }

      // Login otomatis setelah pendaftaran berhasil
      try {
        console.log("Attempting auto-login after registration");
        const result = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });

        console.log("Auto-login result:", result);

        if (result?.error) {
          console.error("Auto-login error:", result.error);
          setError(
            "Pendaftaran berhasil tetapi gagal masuk otomatis. Silakan coba masuk secara manual.",
          );
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (loginError) {
        console.error("Auto-login exception:", loginError);
        setError(
          "Pendaftaran berhasil tetapi gagal masuk otomatis. Silakan coba masuk secara manual.",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pengguna</FormLabel>
              <FormControl>
                <Input placeholder="Nama Pengguna" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kata Sandi</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Kata Sandi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isLoading} type="submit" className="w-full">
          Daftar ke inMedia
        </LoadingButton>
      </form>
    </Form>
  );
}
