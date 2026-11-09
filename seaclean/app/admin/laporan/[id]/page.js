import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Kartu, Memuat } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import RincianLaporan from "@/components/laporan/RincianLaporan";
import { hapusLaporanAdmin } from "../actions";

export const metadata = { title: "Detail Laporan - LautKita" };

export default function DetailLaporanAdminPage({ params }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link href="/admin/laporan" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke daftar laporan
      </Link>
      <Suspense fallback={<Memuat />}>
        <Isi params={params} />
      </Suspense>
    </div>
  );
}

async function Isi({ params }) {
  const id = Number((await params).id);
  const laporan = Number.isInteger(id)
    ? await prisma.laporanPencemaran.findUnique({
        where: { id },
        include: { kategori: true, pelapor: { select: { nama: true } } },
      })
    : null;
  if (!laporan) notFound();

  return (
    <Kartu
      kanan={
        <TombolHapus aksi={hapusLaporanAdmin.bind(null, laporan.id)} konfirmasi="Hapus laporan ini? Gunakan untuk laporan spam atau dobel.">
          Hapus laporan
        </TombolHapus>
      }
    >
      <RincianLaporan laporan={laporan} />
    </Kartu>
  );
}
