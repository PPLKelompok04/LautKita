import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_STATUS_KEGIATAN } from "@/lib/validasi/kegiatan";
import { LABEL_KEHADIRAN, WARNA_KEHADIRAN } from "@/lib/validasi/pendaftaranKegiatan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { hapusPeserta } from "./actions";
import TombolKehadiran from "./TombolKehadiran";

export const metadata = { title: "Peserta Kegiatan - LautKita" };

export default function PesertaKegiatanPage({ searchParams }) {
  return (
    <>
      <Judul judul="Peserta kegiatan" keterangan="PBI-13 · Lihat pendaftar tiap kegiatan dan catat kehadirannya." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { kegiatan: dipilih = "" } = await searchParams;
  await connection();

  const daftar = await prisma.kegiatan.findMany({
    include: { _count: { select: { pendaftaran: true } } },
    orderBy: { tanggal: "desc" },
  });
  const id = Number(dipilih) || daftar[0]?.id;
  const kegiatan = daftar.find((k) => k.id === id);
  const peserta = kegiatan
    ? await prisma.pendaftaranKegiatan.findMany({
        where: { kegiatanId: kegiatan.id },
        include: { user: { select: { nama: true, email: true, noTelepon: true } } },
        orderBy: { createdAt: "asc" },
      })
    : [];
  const hadir = peserta.filter((p) => p.kehadiran === "HADIR").length;

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Kartu judul="Kegiatan" className="h-fit">
        <div className="flex flex-col gap-1 pb-2">
          {daftar.length === 0 && <p className="text-sm text-redup">Belum ada kegiatan.</p>}
          {daftar.map((k) => (
            <Link
              key={k.id}
              href={`/admin/peserta-kegiatan?kegiatan=${k.id}`}
              className={`flex flex-col rounded-xl px-3 py-2 text-xs hover:bg-latar ${k.id === id ? "bg-laut-muda" : ""}`}
            >
              <span className="font-semibold text-teks">{k.judul}</span>
              <span className="text-redup">
                {tampilTanggalJam(k.tanggal)} · {k._count.pendaftaran}/{k.kuota}
              </span>
            </Link>
          ))}
        </div>
      </Kartu>
      {kegiatan && (
        <Kartu
          judul={kegiatan.judul}
          kanan={<Lencana warna={kegiatan.status === "DIBUKA" ? "hijau" : "kuning"}>{LABEL_STATUS_KEGIATAN[kegiatan.status]}</Lencana>}
        >
          <p className="text-xs text-redup">
            {peserta.length} dari {kegiatan.kuota} kuota terisi · {hadir} hadir
          </p>
          <Tabel kolom={["Peserta", "Kontak", "Daftar", "Kehadiran", "Absen", "Aksi"]} kosong="Belum ada yang mendaftar">
            {peserta.map((p) => (
              <tr key={p.id}>
                <td className="font-semibold">{p.user.nama}</td>
                <td>
                  <p>{p.user.email}</p>
                  {p.user.noTelepon && <p className="text-redup">{p.user.noTelepon}</p>}
                </td>
                <td>{tampilTanggalJam(p.createdAt)}</td>
                <td>
                  <Lencana warna={WARNA_KEHADIRAN[p.kehadiran]}>{LABEL_KEHADIRAN[p.kehadiran]}</Lencana>
                </td>
                <td>
                  <TombolKehadiran id={p.id} kehadiran={p.kehadiran} />
                </td>
                <td>
                  <TombolHapus aksi={hapusPeserta.bind(null, p.id)} konfirmasi={`Keluarkan ${p.user.nama} dari kegiatan ini?`}>
                    Keluarkan
                  </TombolHapus>
                </td>
              </tr>
            ))}
          </Tabel>
          <JumlahData n={peserta.length} />
        </Kartu>
      )}
    </div>
  );
}
