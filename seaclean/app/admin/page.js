import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarDays, MapPin, Sprout, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Judul, Memuat, Statistik } from "@/components/admin/Halaman";
import { MENU } from "./menu";

export const metadata = { title: "Ringkasan - LautKita" };

export default function AdminHome() {
  return (
    <>
      <Judul judul="Ringkasan" keterangan="Berikut ringkasan data master LautKita (Sprint 1)." />
      <Suspense fallback={<Memuat />}>
        <Angka />
      </Suspense>
      {MENU.filter((g) => g.grup !== "Menu utama").map((g) => (
        <section key={g.grup} className="flex flex-col gap-2">
          <h2 className="text-[10px] font-bold uppercase text-redup">{g.grup}</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {g.item.map((m) => {
              const Ikon = m.ikon;
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  className="flex items-center gap-3 rounded-2xl border border-garis bg-white p-4 hover:border-laut"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-laut-muda text-laut">
                    <Ikon size={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-teks">{m.label}</span>
                    <span className="block text-[11px] text-redup">{m.pbi}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

async function Angka() {
  await connection();
  // Tanda ?. supaya halaman ini tetap jalan walau model PBI terkait belum di-commit (dianggap 0)
  const [pengguna, lokasi, program, kegiatan] = await Promise.all([
    prisma.user?.count() ?? 0,
    prisma.lokasiBudidaya?.count() ?? 0,
    prisma.programBudidaya?.count() ?? 0,
    prisma.kegiatan?.count() ?? 0,
  ]);
  return (
    <Statistik
      data={[
        { label: "Total pengguna", nilai: pengguna, ikon: Users },
        { label: "Lokasi budidaya", nilai: lokasi, ikon: MapPin, warna: "hijau" },
        { label: "Program budidaya", nilai: program, ikon: Sprout, warna: "ungu" },
        { label: "Kegiatan komunitas", nilai: kegiatan, ikon: CalendarDays, warna: "kuning" },
      ]}
    />
  );
}
