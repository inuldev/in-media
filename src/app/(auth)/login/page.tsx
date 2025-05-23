import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import loginImage from "@/assets/login-image.jpg";

import LoginForm from "./LoginForm";
import GoogleSignInButton from "./google/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-center text-3xl font-bold">Masuk ke inMedia</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, senang bertemu{" "}
              <span className="italic">kamu </span>
              lagi.
            </p>
          </div>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>ATAU</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Belum punya akun? Daftar sekarang
            </Link>
          </div>
        </div>
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
