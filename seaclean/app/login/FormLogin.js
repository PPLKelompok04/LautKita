"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input, PesanError } from "@/components/admin/Field";

export default function FormLogin() {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") || "/";
  const [pesan, setPesan] = useState("");
  const [pending, setPending] = useState(false);

  async function kirim(e) {
    e.preventDefault();
    setPending(true);
    setPesan("");
    const form = new FormData(e.currentTarget);
    const hasil = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setPending(false);
    if (hasil?.error) return setPesan("Email atau password salah, atau akun tidak aktif");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={kirim} className="flex flex-col gap-4">
      <PesanError pesan={pesan} />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Password" name="password" type="password" required autoComplete="current-password" />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-laut px-[18px] text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
