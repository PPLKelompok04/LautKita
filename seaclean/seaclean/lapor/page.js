import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Lencana, Memuat, kode } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import { LABEL_STATUS_LAPORAN, WARNA_STATUS_LAPORAN } from "@/lib/validasi/laporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import FormLaporan from "./FormLaporan";

export const metadata = { title: "Lapor Pencemaran - LautKita" };

export default function LaporPage() {
  return (
    <HalamanAnggota judul="Lapor pencemaran" keterangan="Laporkan sampah, limbah, tumpahan minyak, atau pukat harimau yang kamu temukan.">
      <Suspense fallback={<Memuat />}>
        <Isi />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi() {
  const session = await getSession();
  const [kategori, milikSaya] = await Promise.all([
    prisma.kategoriPencemaran.findMany({ where: { aktif: true }, orderBy: { nama: "asc" }, select: { id: true, nama: true } }),
    prisma.laporanPencemaran.findMany({
      where: { pelaporId: session.user.id },
      include: { kategori: { select: { nama: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      <Kartu judul="Buat laporan baru">
        <FormLaporan kategori={Object.fromEntries(kategori.map((k) => [k.id, k.nama]))} />
      </Kartu>
      <Kartu judul="Laporan saya" kanan={<span className="text-xs text-redup">{milikSaya.length} laporan</span>}>
        {milikSaya.length === 0 && <p className="pb-2 text-sm text-redup">Kamu belum pernah membuat laporan.</p>}
        <div className="flex flex-col divide-y divide-garis">
          {milikSaya.map((l) => (
            <Link key={l.id} href={`/lapor/${l.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-latar">
              <div className="min-w-0">
                <p className="text-[11px] text-redup">
                  {kode("LP", l.id)} · {l.kategori.nama} · {tampilTanggalJam(l.createdAt)}
                </p>
                <p className="truncate text-sm font-semibold text-teks">{l.judul}</p>
              </div>
              <Lencana warna={WARNA_STATUS_LAPORAN[l.status]}>{LABEL_STATUS_LAPORAN[l.status]}</Lencana>
            </Link>
          ))}
        </div>
      </Kartu>
    </>
  );
}
