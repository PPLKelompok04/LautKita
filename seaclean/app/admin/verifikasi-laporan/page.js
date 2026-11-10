import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleCheck, CircleX, Hourglass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Statistik, Tabel, kode } from "@/components/admin/Halaman";
import { namaPelapor } from "@/lib/validasi/laporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";

export const metadata = { title: "Verifikasi Laporan - LautKita" };

export default function VerifikasiLaporanPage({ searchParams }) {
  return (
    <>
      <Judul judul="Verifikasi laporan" keterangan="PBI-11 · Cek laporan pencemaran yang masuk sebelum ditindaklanjuti." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { tab = "menunggu" } = await searchParams;
  await connection();

  const [menunggu, riwayat, jumlahValid, jumlahDitolak] = await Promise.all([
    prisma.laporanPencemaran.findMany({
      where: { status: "MENUNGGU" },
      include: { kategori: { select: { nama: true } }, pelapor: { select: { nama: true } } },
      orderBy: { createdAt: "asc" },
    }),
    tab === "riwayat"
      ? prisma.verifikasiLaporan.findMany({
          include: { laporan: { select: { id: true, judul: true } }, verifikator: { select: { nama: true } } },
          orderBy: { createdAt: "desc" },
          take: 100,
        })
      : [],
    prisma.verifikasiLaporan.count({ where: { keputusan: "VALID" } }),
    prisma.verifikasiLaporan.count({ where: { keputusan: "DITOLAK" } }),
  ]);

  const kelasTab = (aktif) => `rounded-full px-4 py-1.5 text-xs font-semibold ${aktif ? "bg-laut text-white" : "border border-garis bg-white text-teks"}`;

  return (
    <>
      <Statistik
        data={[
          { label: "Menunggu verifikasi", nilai: menunggu.length, ikon: Hourglass, warna: "kuning" },
          { label: "Dinyatakan valid", nilai: jumlahValid, ikon: CircleCheck, warna: "hijau" },
          { label: "Ditolak", nilai: jumlahDitolak, ikon: CircleX, warna: "merah" },
        ]}
      />
      <div className="flex gap-2">
        <Link href="/admin/verifikasi-laporan" className={kelasTab(tab !== "riwayat")}>
          Menunggu
        </Link>
        <Link href="/admin/verifikasi-laporan?tab=riwayat" className={kelasTab(tab === "riwayat")}>
          Riwayat
        </Link>
      </div>
      {tab === "riwayat" ? (
        <Kartu judul="Riwayat verifikasi">
          <Tabel kolom={["Laporan", "Keputusan", "Catatan", "Verifikator", "Waktu"]}>
            {riwayat.map((v) => (
              <tr key={v.id}>
                <td>
                  <Link href={`/admin/verifikasi-laporan/${v.laporan.id}`} className="font-semibold text-laut hover:underline">
                    {kode("LP", v.laporan.id)}
                  </Link>
                  <p>{v.laporan.judul}</p>
                </td>
                <td>
                  <Lencana warna={v.keputusan === "VALID" ? "hijau" : "merah"}>{v.keputusan === "VALID" ? "Valid" : "Ditolak"}</Lencana>
                </td>
                <td className="max-w-72">{v.catatan}</td>
                <td>{v.verifikator.nama}</td>
                <td>{tampilTanggalJam(v.createdAt)}</td>
              </tr>
            ))}
          </Tabel>
          <JumlahData n={riwayat.length} />
        </Kartu>
      ) : (
        <Kartu judul="Antrean verifikasi">
          <Tabel kolom={["Kode", "Laporan", "Pelapor", "Masuk", "Aksi"]} kosong="Tidak ada laporan yang menunggu">
            {menunggu.map((l) => (
              <tr key={l.id}>
                <td className="font-semibold text-laut">{kode("LP", l.id)}</td>
                <td>
                  <p className="font-semibold">{l.judul}</p>
                  <p className="text-redup">{l.kategori.nama}</p>
                </td>
                <td>{namaPelapor(l)}</td>
                <td>{tampilTanggalJam(l.createdAt)}</td>
                <td>
                  <Link href={`/admin/verifikasi-laporan/${l.id}`} className="font-semibold text-laut hover:underline">
                    Verifikasi
                  </Link>
                </td>
              </tr>
            ))}
          </Tabel>
        </Kartu>
      )}
    </>
  );
}
