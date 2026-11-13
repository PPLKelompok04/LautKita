import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleCheck, ClipboardList, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Statistik, Tabel, kode } from "@/components/admin/Halaman";
import { LABEL_STATUS_TINDAK_LANJUT } from "@/lib/validasi/tindakLanjut";
import { tampilTanggalJam } from "@/lib/validasi/umum";

export const metadata = { title: "Tindak Lanjut Laporan - LautKita" };

export default function TindakLanjutPage() {
  return (
    <>
      <Judul judul="Tindak lanjut laporan" keterangan="PBI-12 · Tugaskan petugas ke laporan yang valid dan catat hasil penanganannya." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman />
      </Suspense>
    </>
  );
}

async function IsiHalaman() {
  await connection();
  const session = await getSession();
  const admin = session.user.role === "ADMIN";
  // petugas cuma lihat tugasnya sendiri
  const milik = admin ? {} : { petugasId: session.user.id };

  const [perluDitugaskan, tugas, berjalan, selesai] = await Promise.all([
    admin
      ? prisma.laporanPencemaran.findMany({
          where: { status: "VALID", tindakLanjut: null },
          include: { kategori: { select: { nama: true } } },
          orderBy: { updatedAt: "asc" },
        })
      : [],
    prisma.tindakLanjut.findMany({
      where: milik,
      include: { laporan: { select: { id: true, judul: true } }, petugas: { select: { nama: true } } },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.tindakLanjut.count({ where: { ...milik, status: "DITUGASKAN" } }),
    prisma.tindakLanjut.count({ where: { ...milik, status: "SELESAI" } }),
  ]);

  return (
    <>
      <Statistik
        data={[
          ...(admin ? [{ label: "Perlu ditugaskan", nilai: perluDitugaskan.length, ikon: ClipboardList, warna: "kuning" }] : []),
          { label: admin ? "Sedang ditangani" : "Tugas aktif", nilai: berjalan, ikon: Wrench, warna: "ungu" },
          { label: "Selesai", nilai: selesai, ikon: CircleCheck, warna: "hijau" },
        ]}
      />
      {admin && (
        <Kartu judul="Laporan valid yang belum ditugaskan">
          <Tabel kolom={["Kode", "Laporan", "Diverifikasi", "Aksi"]} kosong="Semua laporan valid sudah ditugaskan">
            {perluDitugaskan.map((l) => (
              <tr key={l.id}>
                <td className="font-semibold text-laut">{kode("LP", l.id)}</td>
                <td>
                  <p className="font-semibold">{l.judul}</p>
                  <p className="text-redup">{l.kategori.nama}</p>
                </td>
                <td>{tampilTanggalJam(l.updatedAt)}</td>
                <td>
                  <Link href={`/admin/tindak-lanjut/${l.id}`} className="font-semibold text-laut hover:underline">
                    Tugaskan
                  </Link>
                </td>
              </tr>
            ))}
          </Tabel>
        </Kartu>
      )}
      <Kartu judul={admin ? "Semua tindak lanjut" : "Tugas saya"}>
        <Tabel kolom={["Laporan", "Petugas", "Ditugaskan", "Status", "Aksi"]} kosong="Belum ada tugas">
          {tugas.map((t) => (
            <tr key={t.id}>
              <td>
                <p className="font-semibold text-laut">{kode("LP", t.laporan.id)}</p>
                <p>{t.laporan.judul}</p>
              </td>
              <td>{t.petugas.nama}</td>
              <td>{tampilTanggalJam(t.createdAt)}</td>
              <td>
                <Lencana warna={t.status === "SELESAI" ? "hijau" : "kuning"}>{LABEL_STATUS_TINDAK_LANJUT[t.status]}</Lencana>
              </td>
              <td>
                <Link href={`/admin/tindak-lanjut/${t.laporan.id}`} className="font-semibold text-laut hover:underline">
                  {t.status === "SELESAI" ? "Lihat" : "Tangani"}
                </Link>
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={tugas.length} />
      </Kartu>
    </>
  );
}
