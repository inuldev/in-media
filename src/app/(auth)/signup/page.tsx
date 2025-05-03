import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

import signupImage from "@/assets/signup-image.jpg";

import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Daftar ke inMedia",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1">
            <h1 className="text-center text-3xl font-bold">
              Daftar ke inMedia
            </h1>
            <p className="text-center text-muted-foreground">
              Tempat dimana <span className="italic">kamu</span> bisa menemukan
              teman baru.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Sudah punya akun?{" "}
              <span className="text-primary">Masuk sekarang</span>
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
