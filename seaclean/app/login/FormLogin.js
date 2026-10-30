"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { PesanError } from "@/components/admin/Field";

const kelasInput =
  "w-full rounded-xl bg-[#e9f5ff] py-[13px] pl-11 text-[13px] text-[#001e2c] outline-none placeholder:text-[#9ca3af] focus:ring-2 focus:ring-[#5bb8fe]";
const kelasLabel = "text-xs font-semibold leading-4 text-[#001e2c]";

export default function FormLogin() {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") || "/";
  const [pesan, setPesan] = useState("");
  const [pending, setPending] = useState(false);
  const [lihatSandi, setLihatSandi] = useState(false);

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
    <form onSubmit={kirim} className="flex flex-col gap-5">
      <PesanError pesan={pesan} />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="email" className={kelasLabel}>
            NIP / Email Instansi Terdaftar
          </label>
          <span className="text-xs text-[#70787e]">Format: @seaclean.id</span>
        </div>
        <div className="relative">
          <Image src="/login/ikon-email.svg" alt="" width={16.667} height={13.333} className="absolute left-[15.67px] top-[14.83px]" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin.pusat@seaclean.id"
            className={`${kelasInput} pr-4`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={kelasLabel}>
            Kata Sandi Administrasi
          </label>
          <span title="Segera hadir" className="cursor-not-allowed text-[11px] font-medium text-[#006398]">
            Lupa Kata Sandi?
          </span>
        </div>
        <div className="relative">
          <Image src="/login/ikon-gembok.svg" alt="" width={13.333} height={17.5} className="absolute left-[17.33px] top-[12.33px]" />
          <input
            id="password"
            name="password"
            type={lihatSandi ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className={`${kelasInput} pr-11`}
          />
          <button
            type="button"
            onClick={() => setLihatSandi(!lihatSandi)}
            aria-label={lihatSandi ? "Sembunyikan sandi" : "Tampilkan sandi"}
            className="absolute right-3.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md hover:bg-[#d0ecff]"
          >
            <Image src="/login/ikon-mata.svg" alt="" width={18.333} height={12.5} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2.5 text-[13px] text-[#001e2c]">
          <input type="checkbox" name="ingat" defaultChecked className="size-4 accent-[#004e6b]" />
          Ingat sesi ini (12 Jam Masa Aktif)
        </label>
        <span className="rounded bg-[#dcf1ff] px-2 py-0.5 text-[11px] font-medium text-[#bfc7ce]">JWT Encrypted</span>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#004e6b] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-60"
      >
        <Image src="/login/ikon-masuk.svg" alt="" width={15} height={15} />
        {pending ? "Memproses..." : "Masuk ke Sistem Administrasi"}
      </button>

      <div className="flex items-center py-2">
        <span className="h-px flex-1 bg-[#c3e8ff]" />
        <span className="px-4 text-[11px] font-medium uppercase tracking-[0.55px] text-[#70787e]">Opsi masuk terverifikasi</span>
        <span className="h-px flex-1 bg-[#c3e8ff]" />
      </div>

      {/* SSO dan security key belum diimplementasikan; tombol ditampilkan sesuai mockup tapi nonaktif */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" disabled title="Segera hadir" className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e9f5ff] py-2.5 text-xs font-semibold text-[#001e2c]">
          <Image src="/login/ikon-sso.svg" alt="" width={16.667} height={16.667} />
          SSO KKP & Kampus
        </button>
        <button type="button" disabled title="Segera hadir" className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e9f5ff] py-2.5 text-xs font-semibold text-[#001e2c]">
          <Image src="/login/ikon-kunci.svg" alt="" width={115} height={60} style={{ width: 19.167, height: 10 }} />
          Security Key (FIDO2)
        </button>
      </div>
    </form>
  );
}
