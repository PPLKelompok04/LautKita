import Link from "next/link";
import { Suspense } from "react";
import { ShieldCheck, Sprout, Trash2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, kode, Lencana, Memuat, Pencarian, PesanInfo, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { kelasTombolKedua } from "@/components/admin/kelas";
import { LABEL_STATUS_PROGRAM } from "@/lib/validasi/program";
import { hapusProgram } from "./actions";
import FormProgram from "./FormProgram";

export const metadata = { title: "Program Budidaya - LautKita" };

const WARNA_STATUS_PROGRAM = { DRAF: "slate", SEGERA_HADIR: "kuning", DIBUKA: "hijau", BERJALAN: "biru", SELESAI: "slate" };

export default function ProgramPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Program budidaya"
        keterangan="PBI-04 · Atur program, jadwal, kapasitas peserta, dan target rehabilitasi pesisir."
        tambah={{ href: "/admin/program", label: "Tambah program" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", pilih } = await searchParams;
  const idPilih = Number(pilih);

  const [daftar, dipilih, daftarLokasi, daftarSpesies] = await Promise.all([
    prisma.programBudidaya.findMany({
      where: {
        OR: [
          { nama: { contains: q, mode: "insensitive" } },
          { lokasi: { nama: { contains: q, mode: "insensitive" } } },
        ],
      },
      include: {
        lokasi: { select: { nama: true, wilayah: { select: { nama: true } } } },
        _count: { select: { peserta: { where: { status: "DISETUJUI" } } } },
      },
      orderBy: { tanggalMulai: "desc" },
    }),
    Number.isInteger(idPilih) && idPilih > 0
      ? prisma.programBudidaya.findUnique({ where: { id: idPilih }, include: { spesies: { select: { namaLokal: true, namaIlmiah: true } } } })
      : null,
    prisma.lokasiBudidaya.findMany({ select: { id: true, nama: true, latitude: true, longitude: true }, orderBy: { nama: "asc" } }),
    prisma.spesies.findMany({ where: { aktif: true }, select: { id: true, namaLokal: true, namaIlmiah: true }, orderBy: { namaLokal: "asc" } }),
  ]);

  return (
    <div className="flex flex-col items-start gap-4 lg:flex-row">
      <div className="flex w-full flex-col gap-3 lg:w-[360px] lg:shrink-0">
        <Kartu judul={`Semua program · ${daftar.length}`}>
          <Pencarian action="/admin/program" q={q} placeholder="Cari nama program atau lokasi" />
          <Tabel kolom={["Program", "Lokasi", "Peserta", "Aksi"]}>
            {daftar.map((p) => (
              <tr key={p.id} className={p.id === dipilih?.id ? "bg-laut-muda" : ""}>
                <td className="font-semibold">
                  <p>{p.nama}</p>
                  <p className="font-normal text-redup">{LABEL_STATUS_PROGRAM[p.status]}</p>
                </td>
                <td>{[p.lokasi.nama, p.lokasi.wilayah?.nama].filter(Boolean).join(", ")}</td>
                <td>
                  {p._count.peserta}/{p.kuotaPeserta}
                </td>
                <td className="whitespace-nowrap font-semibold text-laut">
                  <Link href={`/admin/program?pilih=${p.id}`} className="hover:underline">
                    Edit
                  </Link>
                  {p.status === "DRAF" && (
                    <>
                      {" · "}
                      <TombolHapus
                        aksi={hapusProgram.bind(null, p.id)}
                        konfirmasi={`Hapus program draf "${p.nama}" secara permanen?`}
                        className="font-semibold text-laut hover:underline"
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </Tabel>
          <JumlahData n={daftar.length} />
        </Kartu>

        {dipilih && (
          <Kartu judul="Ringkasan program terpilih">
            {dipilih.fotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dipilih.fotoUrl} alt="" className="h-36 w-full rounded-[14px] object-cover" />
            )}
            <div className="flex items-center justify-between">
              <Lencana warna={WARNA_STATUS_PROGRAM[dipilih.status]}>
                <Sprout size={13} />
                {LABEL_STATUS_PROGRAM[dipilih.status]}
              </Lencana>
              <span className="text-[11px] text-redup">{kode("PRG", dipilih.id)}</span>
            </div>
            <p className="flex items-center gap-2 text-xs text-redup">
              <Users size={14} /> {dipilih.kuotaPeserta} kursi tersedia
            </p>
            <p className="flex items-center gap-2 text-xs text-redup">
              <Sprout size={14} /> Target {dipilih.targetBibit.toLocaleString("id-ID")} bibit · {dipilih.spesies.namaLokal}
            </p>
          </Kartu>
        )}

        <PesanInfo judul="Lindungi data program aktif" ikon={ShieldCheck}>
          Hanya program berstatus Draf yang bisa dihapus. Program yang sudah berjalan cukup diubah statusnya jadi
          Selesai agar riwayatnya tetap tersedia.
        </PesanInfo>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
        <Kartu
          judul={dipilih ? "Edit program budidaya" : "Tambah program budidaya"}
          kanan={
            dipilih && (
              <Lencana warna="biru">
                <Sprout size={13} />
                {kode("PRG", dipilih.id)}
              </Lencana>
            )
          }
        >
          <FormProgram key={dipilih?.id ?? "baru"} program={dipilih} daftarLokasi={daftarLokasi} daftarSpesies={daftarSpesies} />
        </Kartu>

        {dipilih?.status === "DRAF" && (
          <Kartu judul="Hapus program draf">
            <p className="text-[13px] text-redup">{dipilih.nama} masih berstatus draf. Hapus draf ini secara permanen?</p>
            <div className="flex gap-2">
              <Link href="/admin/program" className={`${kelasTombolKedua} flex-1`}>
                Batal
              </Link>
              <TombolHapus
                aksi={hapusProgram.bind(null, dipilih.id)}
                konfirmasi={`Hapus program draf "${dipilih.nama}" secara permanen?`}
                className={`${kelasTombolKedua} flex-1 text-red-600`}
              >
                <Trash2 size={18} /> Hapus draf
              </TombolHapus>
            </div>
          </Kartu>
        )}
      </div>
    </div>
  );
}
