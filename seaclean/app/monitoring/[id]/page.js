import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Memuat } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import FormMonitoring from "../FormMonitoring";
import { hapusMonitoring } from "../actions";
import { opsiProgram } from "../program";
import { tampilTanggalJam } from "@/lib/validasi/umum";

export const metadata = { title: "Ubah Monitoring - LautKita" };

export default function UbahMonitoringPage({ params }) {
  return (
    <HalamanAnggota judul="Ubah catatan monitoring">
      <Link href="/monitoring" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali
      </Link>
      <Suspense fallback={<Memuat />}>
        <Isi params={params} />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi({ params }) {
  const id = Number((await params).id);
  const session = await getSession();
  const monitoring = Number.isInteger(id)
    ? await prisma.monitoringBudidaya.findFirst({
        where: { id, pencatatId: session.user.id, status: { in: ["MENUNGGU", "REVISI"] } },
      })
    : null;
  if (!monitoring) notFound();

  // catatan verifikator terakhir, ditampilkan langsung (dulu hanya lewat notifikasi)
  const revisi =
    monitoring.status === "REVISI"
      ? await prisma.verifikasiHasil.findFirst({
          where: { monitoringId: monitoring.id, keputusan: "REVISI" },
          orderBy: { createdAt: "desc" },
          select: { catatan: true, createdAt: true, verifikator: { select: { nama: true } } },
        })
      : null;

  return (
    <Kartu kanan={<TombolHapus aksi={hapusMonitoring.bind(null, monitoring.id)} konfirmasi="Hapus catatan ini?" />}>
      {monitoring.status === "REVISI" && (
        <div className="flex flex-col gap-0.5 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <p className="font-semibold">Perlu revisi</p>
          {revisi ? (
            <>
              <p className="whitespace-pre-line text-sm">{revisi.catatan}</p>
              <p className="text-amber-800">
                {revisi.verifikator.nama} · {tampilTanggalJam(revisi.createdAt)}
              </p>
            </>
          ) : (
            <p>Perbaiki catatan lalu kirim ulang.</p>
          )}
        </div>
      )}
      <FormMonitoring monitoring={monitoring} program={await opsiProgram(session.user)} />
    </Kartu>
  );
}
