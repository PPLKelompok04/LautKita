import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarDays, FileText, MapPin, Sprout, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Lencana, Memuat } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import { LABEL_STATUS_PROGRAM } from "@/lib/validasi/program";
import { LABEL_STATUS_PESERTA, WARNA_STATUS_PESERTA } from "@/lib/validasi/pesertaProgram";
import { sudahLewat } from "@/lib/validasi/umum";
import FormGabung from "./FormGabung";

export const metadata = { title: "Program Budidaya - LautKita" };

const tanggal = (d) => new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "UTC" });

export default function ProgramAnggotaPage() {
  return (
    <HalamanAnggota judul="Program budidaya" keterangan="Gabung program budidaya terumbu karang, ikan, dan mangrove.">
      <Suspense fallback={<Memuat />}>
        <Isi />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi() {
  await connection();
  const session = await getSession();

  const daftar = await prisma.programBudidaya.findMany({
    where: { status: { in: ["DIBUKA", "BERJALAN"] } },
    include: {
      lokasi: { select: { nama: true } },
      spesies: { select: { namaLokal: true } },
      _count: { select: { peserta: { where: { status: "DISETUJUI" } } } },
      peserta: { where: { userId: session.user.id }, select: { status: true, catatan: true } },
    },
    orderBy: { tanggalMulai: "asc" },
  });

  if (daftar.length === 0) return <p className="text-sm text-redup">Belum ada program yang dibuka.</p>;

  return daftar.map((p) => {
    const saya = p.peserta[0];
    return (
      <article key={p.id} className="flex flex-col gap-3 rounded-2xl border border-garis bg-white p-4">
        {p.fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.fotoUrl} alt="" className="h-40 w-full rounded-xl object-cover" />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Lencana warna={p.status === "DIBUKA" ? "hijau" : "biru"}>{LABEL_STATUS_PROGRAM[p.status]}</Lencana>
          {saya && <Lencana warna={WARNA_STATUS_PESERTA[saya.status]}>{LABEL_STATUS_PESERTA[saya.status]}</Lencana>}
        </div>
        <div>
          <h2 className="text-base font-bold text-teks">{p.nama}</h2>
          <p className="text-xs text-redup">{p.penyelenggara}</p>
        </div>
        <p className="line-clamp-3 text-xs text-teks">{p.deskripsi}</p>
        <div className="grid gap-1 text-xs text-teks sm:grid-cols-2">
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} /> {p.lokasi.nama}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sprout size={14} /> {p.spesies.namaLokal}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} /> {tanggal(p.tanggalMulai)} – {tanggal(p.tanggalSelesai)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={14} /> {p._count.peserta}/{p.kuotaPeserta} peserta · daftar s.d. {tanggal(p.batasPendaftaran)}
          </span>
        </div>
        <p className="rounded-xl bg-latar px-3 py-2 text-xs text-teks">Syarat: {p.persyaratan}</p>
        {saya?.status === "DITOLAK" && saya.catatan && <p className="text-xs text-red-700">Alasan ditolak: {saya.catatan}</p>}
        {p.dokumenUrl && (
          <a href={p.dokumenUrl} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-laut hover:underline">
            <FileText size={14} /> Dokumen program (PDF)
          </a>
        )}
        {/* pendaftar yang sudah ada tetap bisa membatalkan; pendaftar baru hanya selama masih dibuka */}
        {p.status === "DIBUKA" && (saya || !sudahLewat(p.batasPendaftaran)) && <FormGabung programId={p.id} status={saya?.status} />}
        {p.status === "DIBUKA" && !saya && sudahLewat(p.batasPendaftaran) && (
          <p className="text-xs font-semibold text-redup">Pendaftaran sudah ditutup</p>
        )}
      </article>
    );
  });
}
