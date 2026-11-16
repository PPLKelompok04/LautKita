import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Memuat } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import RincianLaporan from "@/components/laporan/RincianLaporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import FormLaporan from "../FormLaporan";
import { hapusLaporan } from "../actions";

export const metadata = { title: "Detail Laporan - LautKita" };

const LANGKAH = [
  { status: "MENUNGGU", label: "Dikirim" },
  { status: "VALID", label: "Diverifikasi" },
  { status: "DITINDAKLANJUTI", label: "Ditindaklanjuti" },
  { status: "SELESAI", label: "Selesai" },
];

export default function DetailLaporanPage({ params }) {
  return (
    <HalamanAnggota>
      <Link href="/lapor" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke laporan saya
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
  const laporan = Number.isInteger(id)
    ? await prisma.laporanPencemaran.findFirst({
        where: { id, pelaporId: session.user.id },
        include: {
          kategori: true,
          pelapor: { select: { nama: true } },
          // hasil verifikasi & penanganan ditampilkan ke pelapor (dulu hanya lewat notifikasi)
          verifikasi: { select: { keputusan: true, catatan: true, createdAt: true } },
          tindakLanjut: { select: { status: true, catatanPenanganan: true, buktiUrl: true, selesaiAt: true, createdAt: true } },
        },
      })
    : null;
  if (!laporan) notFound();

  if (laporan.status === "MENUNGGU") {
    const kategori = await prisma.kategoriPencemaran.findMany({ where: { aktif: true }, orderBy: { nama: "asc" } });
    return (
      <>
        <Kartu judul="Status">
          <Langkah status={laporan.status} />
        </Kartu>
        <Kartu judul="Ubah laporan" kanan={<TombolHapus aksi={hapusLaporan.bind(null, laporan.id)} konfirmasi="Hapus laporan ini?" />}>
          <FormLaporan laporan={laporan} kategori={Object.fromEntries(kategori.map((k) => [k.id, k.nama]))} />
        </Kartu>
      </>
    );
  }

  return (
    <>
      <Kartu judul="Status">
        <Langkah status={laporan.status} />
      </Kartu>
      {laporan.verifikasi && (
        <Kartu judul={laporan.verifikasi.keputusan === "DITOLAK" ? "Alasan penolakan" : "Catatan verifikator"}>
          <p className={`whitespace-pre-line pb-1 text-sm ${laporan.verifikasi.keputusan === "DITOLAK" ? "text-red-700" : "text-teks"}`}>
            {laporan.verifikasi.catatan}
          </p>
          <p className="pb-2 text-xs text-redup">Diverifikasi {tampilTanggalJam(laporan.verifikasi.createdAt)}</p>
        </Kartu>
      )}
      {laporan.tindakLanjut && (
        <Kartu judul="Penanganan">
          {laporan.tindakLanjut.status === "SELESAI" ? (
            <div className="flex flex-col gap-2 pb-2">
              <p className="whitespace-pre-line text-sm text-teks">{laporan.tindakLanjut.catatanPenanganan}</p>
              {laporan.tindakLanjut.buktiUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={laporan.tindakLanjut.buktiUrl} alt="Bukti penanganan" className="max-h-72 w-full rounded-xl object-cover" />
              )}
              <p className="text-xs text-redup">Selesai ditangani {tampilTanggalJam(laporan.tindakLanjut.selesaiAt)}</p>
            </div>
          ) : (
            <p className="pb-2 text-sm text-teks">
              Petugas lapangan sudah ditugaskan sejak {tampilTanggalJam(laporan.tindakLanjut.createdAt)} dan sedang menangani laporan ini.
            </p>
          )}
        </Kartu>
      )}
      <Kartu>
        <RincianLaporan laporan={laporan} />
      </Kartu>
    </>
  );
}

function Langkah({ status }) {
  if (status === "DITOLAK") {
    return <p className="text-sm text-red-700">Laporan ini ditolak verifikator. Alasannya ada di bawah.</p>;
  }
  const posisi = LANGKAH.findIndex((l) => l.status === status);
  return (
    <ol className="grid grid-cols-4 gap-2 pb-1">
      {LANGKAH.map((l, i) => (
        <li key={l.status} className="flex flex-col gap-1.5">
          <span className={`h-1.5 rounded-full ${i <= posisi ? "bg-laut" : "bg-garis"}`} />
          <span className={`text-[11px] ${i <= posisi ? "font-semibold text-teks" : "text-redup"}`}>{l.label}</span>
        </li>
      ))}
    </ol>
  );
}
