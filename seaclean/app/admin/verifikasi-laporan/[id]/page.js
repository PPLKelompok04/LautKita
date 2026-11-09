import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Kartu, Lencana, Memuat } from "@/components/admin/Halaman";
import RincianLaporan from "@/components/laporan/RincianLaporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import FormVerifikasi from "../FormVerifikasi";

export const metadata = { title: "Verifikasi Laporan - LautKita" };

export default function DetailVerifikasiPage({ params }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link href="/admin/verifikasi-laporan" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke antrean
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
        include: {
          kategori: true,
          pelapor: { select: { nama: true } },
          verifikasi: { include: { verifikator: { select: { nama: true } } } },
        },
      })
    : null;
  if (!laporan) notFound();
  const v = laporan.verifikasi;

  return (
    <>
      <Kartu>
        <RincianLaporan laporan={laporan} />
      </Kartu>
      {v ? (
        <Kartu judul="Hasil verifikasi">
          <div className="flex flex-col gap-1 pb-2 text-sm">
            <Lencana warna={v.keputusan === "VALID" ? "hijau" : "merah"}>{v.keputusan === "VALID" ? "Valid" : "Ditolak"}</Lencana>
            <p className="text-teks">{v.catatan}</p>
            <p className="text-xs text-redup">
              {v.verifikator.nama} · {tampilTanggalJam(v.createdAt)}
            </p>
          </div>
        </Kartu>
      ) : (
        <Kartu judul="Verifikasi">
          <FormVerifikasi laporanId={laporan.id} />
        </Kartu>
      )}
    </>
  );
}
