import { Suspense } from "react";
import Image from "next/image";
import FormLogin from "./FormLogin";

export const metadata = { title: "Masuk - LautKita" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-latar p-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-laut px-6 py-5">
          <Image src="/lautkita-logo.svg" alt="" width={44} height={44} priority />
          <div>
            <p className="text-xl font-extrabold leading-tight text-white">LAUTKITA</p>
            <p className="text-[11px] text-laut-pucat">Platform Komunitas Pelestarian Laut</p>
          </div>
        </div>
        <div className="rounded-2xl border border-garis bg-white p-6">
          <h1 className="mb-1 text-2xl font-bold text-teks">Masuk</h1>
          <p className="mb-6 text-[13px] text-redup">Gunakan akun yang sudah terdaftar.</p>
          <Suspense>
            <FormLogin />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
