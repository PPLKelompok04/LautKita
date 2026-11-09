import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Lencana, Memuat } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import { LABEL_JENIS_KEGIATAN, LABEL_STATUS_KEGIATAN } from "@/lib/validasi/kegiatan";
import { LABEL_KEHADIRAN, WARNA_KEHADIRAN } from "@/lib/validasi/pendaftaranKegiatan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import TombolDaftar from "./TombolDaftar";

export const metadata = { title: "Kegiatan Komunitas - LautKita" };

export default function KegiatanAnggotaPage() {
  return (
    <HalamanAnggota judul="Kegiatan komunitas" keterangan="Ikut aksi bersih pantai, tanam mangrove, dan kegiatan lainnya.">
      <Suspense fallback={<Memuat />}>
        <Isi />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi() {
  await connection();
  const session = await getSession();
  const sekarang = new Date();

  const [daftar, diikuti] = await Promise.all([
    prisma.kegiatan.findMany({
      where: { tanggal: { gte: sekarang }, status: { in: ["DIBUKA", "PENUH"] } },
      include: {
        wilayah: { select: { nama: true } },
        _count: { select: { pendaftaran: true } },
        pendaftaran: { where: { userId: session.user.id }, select: { id: true } },
      },
      orderBy: { tanggal: "asc" },
    }),
    prisma.pendaftaranKegiatan.findMany({
      where: { userId: session.user.id },
      include: { kegiatan: { select: { judul: true, tanggal: true, namaLokasi: true } } },
      orderBy: { kegiatan: { tanggal: "desc" } },
    }),
  ]);

  return (
    <>
      {daftar.length === 0 && <p className="text-sm text-redup">Belum ada kegiatan yang dibuka.</p>}
      {daftar.map((k) => {
        const terdaftar = k.pendaftaran.length > 0;
        return (
          <article key={k.id} className="flex flex-col gap-3 rounded-2xl border border-garis bg-white p-4 sm:flex-row">
            {k.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={k.fotoUrl} alt="" className="h-32 w-full rounded-xl object-cover sm:w-44" />
            )}
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Lencana warna="biru">{LABEL_JENIS_KEGIATAN[k.jenis]}</Lencana>
                <Lencana warna={k.status === "PENUH" ? "kuning" : "hijau"}>{LABEL_STATUS_KEGIATAN[k.status]}</Lencana>
                {terdaftar && <Lencana warna="hijau">Kamu terdaftar</Lencana>}
              </div>
              <h2 className="text-base font-bold text-teks">{k.judul}</h2>
              {k.deskripsi && <p className="line-clamp-2 text-xs text-redup">{k.deskripsi}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-teks">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={14} /> {tampilTanggalJam(k.tanggal)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {[k.namaLokasi, k.wilayah?.nama].filter(Boolean).join(", ")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} /> {k._count.pendaftaran}/{k.kuota} peserta
                </span>
              </div>
              <div>
                <TombolDaftar kegiatanId={k.id} terdaftar={terdaftar} bisaDaftar={k.status === "DIBUKA"} />
              </div>
            </div>
          </article>
        );
      })}

      <Kartu judul="Kegiatan yang saya ikuti">
        {diikuti.length === 0 && <p className="pb-2 text-sm text-redup">Belum ada.</p>}
        <div className="flex flex-col divide-y divide-garis">
          {diikuti.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-teks">{d.kegiatan.judul}</p>
                <p className="text-[11px] text-redup">
                  {tampilTanggalJam(d.kegiatan.tanggal)} · {d.kegiatan.namaLokasi}
                </p>
              </div>
              <Lencana warna={WARNA_KEHADIRAN[d.kehadiran]}>{LABEL_KEHADIRAN[d.kehadiran]}</Lencana>
            </div>
          ))}
        </div>
      </Kartu>
    </>
  );
}
