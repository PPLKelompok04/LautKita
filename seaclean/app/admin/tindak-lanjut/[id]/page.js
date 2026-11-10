import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Lencana, Memuat } from "@/components/admin/Halaman";
import RincianLaporan from "@/components/laporan/RincianLaporan";
import { LABEL_STATUS_TINDAK_LANJUT } from "@/lib/validasi/tindakLanjut";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { FormPenanganan, FormPenugasan } from "../FormTindakLanjut";

export const metadata = { title: "Tindak Lanjut - LautKita" };

export default function DetailTindakLanjutPage({ params }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <Link href="/admin/tindak-lanjut" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke tindak lanjut
      </Link>
      <Suspense fallback={<Memuat />}>
        <Isi params={params} />
      </Suspense>
    </div>
  );
}

async function Isi({ params }) {
  const id = Number((await params).id);
  const [session, laporan] = await Promise.all([
    getSession(),
    Number.isInteger(id)
      ? prisma.laporanPencemaran.findUnique({
          where: { id },
          include: {
            kategori: true,
            pelapor: { select: { nama: true } },
            verifikasi: { include: { verifikator: { select: { nama: true } } } },
            tindakLanjut: { include: { petugas: { select: { nama: true } } } },
          },
        })
      : null,
  ]);
  if (!laporan) notFound();
  const admin = session.user.role === "ADMIN";
  const t = laporan.tindakLanjut;
  if (!admin && t?.petugasId !== session.user.id) notFound();

  const petugas = admin && !t
    ? await prisma.user.findMany({ where: { aktif: true, role: { kode: "PETUGAS" } }, orderBy: { nama: "asc" }, select: { id: true, nama: true } })
    : [];

  return (
    <>
      <Kartu>
        <RincianLaporan laporan={laporan} />
        {laporan.verifikasi && (
          <p className="rounded-xl bg-latar px-3 py-2 text-xs text-teks">
            Catatan verifikator ({laporan.verifikasi.verifikator.nama}): {laporan.verifikasi.catatan}
          </p>
        )}
      </Kartu>

      {!t && laporan.status === "VALID" && (
        <Kartu judul="Tugaskan petugas">
          {petugas.length ? (
            <FormPenugasan laporanId={laporan.id} petugas={Object.fromEntries(petugas.map((p) => [p.id, p.nama]))} />
          ) : (
            <p className="pb-2 text-sm text-redup">Belum ada user dengan role Petugas lapangan. Tambahkan dulu di Manajemen pengguna.</p>
          )}
        </Kartu>
      )}

      {t && (
        <Kartu judul="Tindak lanjut" kanan={<Lencana warna={t.status === "SELESAI" ? "hijau" : "kuning"}>{LABEL_STATUS_TINDAK_LANJUT[t.status]}</Lencana>}>
          <div className="flex flex-col gap-1 text-sm">
            <p>
              Petugas: <span className="font-semibold">{t.petugas.nama}</span> · ditugaskan {tampilTanggalJam(t.createdAt)}
            </p>
            {t.instruksi && <p className="text-redup">Instruksi: {t.instruksi}</p>}
          </div>
          {t.status === "SELESAI" ? (
            <div className="flex flex-col gap-2 pb-2 text-sm">
              <p className="whitespace-pre-line">{t.catatanPenanganan}</p>
              {t.buktiUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.buktiUrl} alt="Bukti penanganan" className="max-h-72 w-full rounded-xl object-cover" />
              )}
              <p className="text-xs text-redup">Selesai {tampilTanggalJam(t.selesaiAt)}</p>
            </div>
          ) : (
            <FormPenanganan laporanId={laporan.id} />
          )}
        </Kartu>
      )}
    </>
  );
}
