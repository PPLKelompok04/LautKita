import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleCheck, FileWarning, Hourglass, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel, kode } from "@/components/admin/Halaman";
import { LABEL_STATUS_LAPORAN, WARNA_STATUS_LAPORAN, namaPelapor } from "@/lib/validasi/laporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";

export const metadata = { title: "Laporan Pencemaran - LautKita" };

export default function LaporanPage({ searchParams }) {
  return (
    <>
      <Judul judul="Laporan pencemaran" keterangan="PBI-09 · Semua laporan yang dikirim anggota." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", status = "", kategori = "" } = await searchParams;
  await connection();

  const [data, total, menunggu, proses, selesai, daftarKategori] = await Promise.all([
    prisma.laporanPencemaran.findMany({
      where: {
        OR: [{ judul: { contains: q, mode: "insensitive" } }, { alamat: { contains: q, mode: "insensitive" } }],
        ...(LABEL_STATUS_LAPORAN[status] ? { status } : {}),
        ...(Number(kategori) ? { kategoriId: Number(kategori) } : {}),
      },
      include: { kategori: { select: { nama: true } }, pelapor: { select: { nama: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.laporanPencemaran.count(),
    prisma.laporanPencemaran.count({ where: { status: "MENUNGGU" } }),
    prisma.laporanPencemaran.count({ where: { status: { in: ["VALID", "DITINDAKLANJUTI"] } } }),
    prisma.laporanPencemaran.count({ where: { status: "SELESAI" } }),
    prisma.kategoriPencemaran.findMany({ orderBy: { nama: "asc" }, select: { id: true, nama: true } }),
  ]);

  const kelasSelect = "min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs";

  return (
    <>
      <Statistik
        data={[
          { label: "Total laporan", nilai: total, ikon: FileWarning },
          { label: "Menunggu verifikasi", nilai: menunggu, ikon: Hourglass, warna: "kuning" },
          { label: "Sedang diproses", nilai: proses, ikon: Wrench, warna: "ungu" },
          { label: "Selesai", nilai: selesai, ikon: CircleCheck, warna: "hijau" },
        ]}
      />
      <Kartu judul="Daftar laporan">
        <Pencarian action="/admin/laporan" q={q} placeholder="Cari judul atau lokasi">
          <div className="w-44">
            <select name="status" defaultValue={status} className={kelasSelect}>
              <option value="">Semua status</option>
              {Object.entries(LABEL_STATUS_LAPORAN).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="w-44">
            <select name="kategori" defaultValue={kategori} className={kelasSelect}>
              <option value="">Semua kategori</option>
              {daftarKategori.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Kode", "Laporan", "Pelapor", "Tanggal", "Status", "Aksi"]}>
          {data.map((l) => (
            <tr key={l.id}>
              <td className="font-semibold text-laut">{kode("LP", l.id)}</td>
              <td>
                <p className="font-semibold">{l.judul}</p>
                <p className="text-redup">{l.kategori.nama}</p>
              </td>
              <td>{namaPelapor(l)}</td>
              <td>{tampilTanggalJam(l.createdAt)}</td>
              <td>
                <Lencana warna={WARNA_STATUS_LAPORAN[l.status]}>{LABEL_STATUS_LAPORAN[l.status]}</Lencana>
              </td>
              <td>
                <Link href={`/admin/laporan/${l.id}`} className="font-semibold text-laut hover:underline">
                  Detail
                </Link>
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={data.length} total={total} />
      </Kartu>
    </>
  );
}
