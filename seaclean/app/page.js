import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";

// Kelas ditulis lengkap, bukan menimpa kelasTombolUtama/Kedua: tanpa tailwind-merge, kelas warna yang bentrok
// (mis. bg-laut vs bg-white) tidak bisa ditebak mana yang menang, dan dulu membuat teks tombol tidak terlihat.
const kelasDasar = "inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border px-[18px] py-2 text-sm font-semibold";
const kelasPutih = `${kelasDasar} border-white bg-white text-laut hover:bg-laut-muda`;
const kelasGaris = `${kelasDasar} border-white/60 bg-transparent text-white hover:bg-white/10`;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-laut p-8 text-center">
      <Image src="/lautkita-logo.svg" alt="" width={64} height={64} priority />
      <div>
        <h1 className="text-4xl font-extrabold text-white">LAUTKITA</h1>
        <p className="text-sm text-laut-pucat">Platform Komunitas Pelestarian Laut</p>
      </div>
      <p className="max-w-md text-sm text-white/85">
        Budidaya terumbu karang, ikan, dan mangrove, pelaporan pencemaran, serta timeline komunitas dalam satu tempat.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/timeline" className={kelasPutih}>
          Buka timeline
        </Link>
        <Suspense>
          <TombolKedua />
        </Suspense>
      </div>
    </main>
  );
}

// Tamu: tombol Masuk. Sudah login: Panel admin hanya kalau role-nya punya akses panel.
async function TombolKedua() {
  const session = await getSession();
  if (!session?.user) {
    return (
      <Link href="/login" className={kelasGaris}>
        Masuk
      </Link>
    );
  }
  if (session.user.role !== "ADMIN" && !session.user.akses?.length) return null;
  return (
    <Link href="/admin" className={kelasGaris}>
      Panel admin
    </Link>
  );
}
