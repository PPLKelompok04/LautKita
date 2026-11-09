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

  return (
    <Kartu kanan={<TombolHapus aksi={hapusMonitoring.bind(null, monitoring.id)} konfirmasi="Hapus catatan ini?" />}>
      {monitoring.status === "REVISI" && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">Perlu revisi. Alasannya ada di notifikasi dari verifikator.</p>
      )}
      <FormMonitoring monitoring={monitoring} program={await opsiProgram(session.user)} />
    </Kartu>
  );
}
