import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Kartu, Lencana, Memuat } from "@/components/admin/Halaman";
import { LABEL_JENIS_MONITORING, LABEL_STATUS_MONITORING, WARNA_STATUS_MONITORING, tingkatHidup } from "@/lib/validasi/monitoring";
import { LABEL_KEPUTUSAN_HASIL, WARNA_KEPUTUSAN_HASIL } from "@/lib/validasi/verifikasiHasil";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import FormVerifikasiHasil from "../FormVerifikasiHasil";

export const metadata = { title: "Verifikasi Hasil - LautKita" };

const tanggal = (d) => new Date(d).toLocaleDateString("id-ID", { dateStyle: "long", timeZone: "UTC" });

export default function DetailVerifikasiHasilPage({ params }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link href="/admin/verifikasi-hasil" className="text-xs font-semibold text-laut hover:underline">
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
  const m = Number.isInteger(id)
    ? await prisma.monitoringBudidaya.findUnique({
        where: { id },
        include: {
          program: { select: { nama: true, targetBibit: true } },
          pencatat: { select: { nama: true } },
          verifikasi: { include: { verifikator: { select: { nama: true } } }, orderBy: { createdAt: "desc" } },
        },
      })
    : null;
  if (!m) notFound();

  return (
    <>
      <Kartu judul={m.program.nama} kanan={<Lencana warna={WARNA_STATUS_MONITORING[m.status]}>{LABEL_STATUS_MONITORING[m.status]}</Lencana>}>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-redup">Pencatat:</span> {m.pencatat.nama}
          </p>
          <p>
            <span className="text-redup">Tanggal:</span> {tanggal(m.tanggal)}
          </p>
          <p>
            <span className="text-redup">Jenis:</span> {LABEL_JENIS_MONITORING[m.jenis]}
          </p>
          <p>
            <span className="text-redup">Tingkat hidup:</span>{" "}
            <span className="font-semibold">
              {m.jumlahHidup}/{m.jumlahDitanam} ({tingkatHidup(m.jumlahDitanam, m.jumlahHidup)}%)
            </span>
          </p>
        </div>
        {m.catatan && <p className="whitespace-pre-line text-sm text-teks">{m.catatan}</p>}
        {m.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.fotoUrl} alt="Foto monitoring" className="max-h-80 w-full rounded-xl object-cover" />
        ) : (
          <p className="pb-2 text-xs text-redup">Tidak ada foto.</p>
        )}
      </Kartu>

      {m.status === "MENUNGGU" && (
        <Kartu judul="Penilaian">
          <FormVerifikasiHasil monitoringId={m.id} />
        </Kartu>
      )}

      {m.verifikasi.length > 0 && (
        <Kartu judul="Riwayat penilaian">
          <div className="flex flex-col divide-y divide-garis pb-2">
            {m.verifikasi.map((v) => (
              <div key={v.id} className="flex flex-col gap-1 py-2 text-sm">
                <Lencana warna={WARNA_KEPUTUSAN_HASIL[v.keputusan]}>{LABEL_KEPUTUSAN_HASIL[v.keputusan]}</Lencana>
                <p>{v.catatan}</p>
                <p className="text-xs text-redup">
                  {v.verifikator.nama} · {tampilTanggalJam(v.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Kartu>
      )}
    </>
  );
}
