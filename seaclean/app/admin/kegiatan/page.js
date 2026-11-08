import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarCheck, CalendarClock, CalendarDays, DoorOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_JENIS_KEGIATAN, LABEL_STATUS_KEGIATAN } from "@/lib/validasi/kegiatan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { hapusKegiatan } from "./actions";

export const metadata = { title: "Kegiatan Komunitas - LautKita" };

const WARNA_STATUS = { DIBUKA: "hijau", PENUH: "kuning", DITUTUP: "kuning", SELESAI: "biru", DIBATALKAN: "merah" };

export default function KegiatanPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Kegiatan komunitas"
        keterangan="PBI-05 · Kelola kegiatan seperti bersih pantai dan tanam mangrove."
        tambah={{ href: "/admin/kegiatan/baru", label: "Buat kegiatan" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", status = "" } = await searchParams;
  await connection();
  const sekarang = new Date();

  const [data, total, dibuka, akanDatang, selesai] = await Promise.all([
    prisma.kegiatan.findMany({
      where: {
        OR: [
          { judul: { contains: q, mode: "insensitive" } },
          { namaLokasi: { contains: q, mode: "insensitive" } },
        ],
        ...(LABEL_STATUS_KEGIATAN[status] ? { status } : {}),
      },
      include: { wilayah: { select: { nama: true } } },
      orderBy: { tanggal: "desc" },
    }),
    prisma.kegiatan.count(),
    prisma.kegiatan.count({ where: { status: "DIBUKA" } }),
    prisma.kegiatan.count({ where: { tanggal: { gte: sekarang }, status: { not: "DIBATALKAN" } } }),
    prisma.kegiatan.count({ where: { status: "SELESAI" } }),
  ]);

  return (
    <>
      <Statistik
        data={[
          { label: "Total kegiatan", nilai: total, ikon: CalendarDays },
          { label: "Pendaftaran dibuka", nilai: dibuka, ikon: DoorOpen, warna: "hijau" },
          { label: "Akan datang", nilai: akanDatang, ikon: CalendarClock, warna: "kuning" },
          { label: "Selesai", nilai: selesai, ikon: CalendarCheck, warna: "ungu" },
        ]}
      />
      <Kartu judul="Daftar kegiatan">
        <Pencarian action="/admin/kegiatan" q={q} placeholder="Cari nama kegiatan atau lokasi">
          <div className="w-52">
            <select name="status" defaultValue={status} className="min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs">
              <option value="">Semua status</option>
              {Object.entries(LABEL_STATUS_KEGIATAN).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Kegiatan", "Jenis", "Lokasi & jadwal", "Kuota", "Status", "Aksi"]}>
          {data.map((k) => (
            <tr key={k.id}>
              <td className="font-semibold">{k.judul}</td>
              <td>{LABEL_JENIS_KEGIATAN[k.jenis]}</td>
              <td>
                <p className="font-semibold">{[k.namaLokasi, k.wilayah?.nama].filter(Boolean).join(", ")}</p>
                <p className="text-redup">{tampilTanggalJam(k.tanggal)}</p>
              </td>
              <td className="font-semibold">{k.kuota} peserta</td>
              <td>
                <Lencana warna={WARNA_STATUS[k.status]}>{LABEL_STATUS_KEGIATAN[k.status]}</Lencana>
              </td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <Link href={`/admin/kegiatan/${k.id}`} className="hover:underline">
                  Edit
                </Link>
                {" · "}
                <TombolHapus
                  aksi={hapusKegiatan.bind(null, k.id)}
                  konfirmasi={`Hapus kegiatan "${k.judul}"?`}
                  className="font-semibold text-laut hover:underline"
                />
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={data.length} total={total} />
      </Kartu>
    </>
  );
}
