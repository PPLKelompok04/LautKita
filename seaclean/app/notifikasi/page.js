import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Memuat } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { bacaSemua, bukaNotifikasi } from "./actions";

export const metadata = { title: "Notifikasi - LautKita" };

export default function NotifikasiPage() {
  return (
    <HalamanAnggota judul="Notifikasi">
      <Suspense fallback={<Memuat />}>
        <Daftar />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Daftar() {
  const session = await getSession();
  const daftar = await prisma.notifikasi.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (daftar.length === 0) return <p className="text-sm text-redup">Belum ada notifikasi.</p>;

  return (
    <>
      {daftar.some((n) => !n.dibaca) && (
        <form action={bacaSemua} className="self-end">
          <button className="text-xs font-semibold text-laut hover:underline">Tandai semua sudah dibaca</button>
        </form>
      )}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-white">
        {daftar.map((n) => (
          <form key={n.id} action={bukaNotifikasi.bind(null, n.id)} className="border-b border-garis last:border-0">
            <button className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-latar ${n.dibaca ? "" : "bg-laut-muda/60"}`}>
              <span className="flex items-center gap-2 text-sm font-semibold text-teks">
                {!n.dibaca && <span className="size-2 rounded-full bg-laut" />}
                {n.judul}
              </span>
              <span className="text-xs text-teks">{n.isi}</span>
              <span className="text-[11px] text-redup">{tampilTanggalJam(n.createdAt)}</span>
            </button>
          </form>
        ))}
      </div>
    </>
  );
}
