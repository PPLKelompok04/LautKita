import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleCheck, Hourglass, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Statistik, Tabel } from "@/components/admin/Halaman";
import { LABEL_JENIS_MONITORING, tingkatHidup } from "@/lib/validasi/monitoring";
import { LABEL_KEPUTUSAN_HASIL, WARNA_KEPUTUSAN_HASIL } from "@/lib/validasi/verifikasiHasil";
import { tampilTanggalJam } from "@/lib/validasi/umum";

export const metadata = { title: "Verifikasi Hasil Budidaya - LautKita" };

const tanggal = (d) => new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "UTC" });

export default function VerifikasiHasilPage({ searchParams }) {
  return (
    <>
      <Judul judul="Verifikasi Hasil Budidaya" keterangan="PBI-16 · Nilai catatan monitoring dari peserta program." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { tab = "menunggu" } = await searchParams;
  await connection();

  const [menunggu, riwayat, diterima, revisi] = await Promise.all([
    prisma.monitoringBudidaya.findMany({
      where: { status: "MENUNGGU" },
      include: { program: { select: { nama: true } }, pencatat: { select: { nama: true } } },
      orderBy: { updatedAt: "asc" },
    }),
    tab === "riwayat"
      ? prisma.verifikasiHasil.findMany({
          include: { monitoring: { select: { id: true, program: { select: { nama: true } } } }, verifikator: { select: { nama: true } } },
          orderBy: { createdAt: "desc" },
          take: 100,
        })
      : [],
    prisma.monitoringBudidaya.count({ where: { status: "DITERIMA" } }),
    prisma.monitoringBudidaya.count({ where: { status: "REVISI" } }),
  ]);

  const kelasTab = (aktif) => `rounded-full px-4 py-1.5 text-xs font-semibold ${aktif ? "bg-laut text-white" : "border border-garis bg-white text-teks"}`;

  return (
    <>
      <Statistik
        data={[
          { label: "Menunggu verifikasi", nilai: menunggu.length, ikon: Hourglass, warna: "kuning" },
          { label: "Diterima", nilai: diterima, ikon: CircleCheck, warna: "hijau" },
          { label: "Sedang direvisi", nilai: revisi, ikon: RotateCcw, warna: "ungu" },
        ]}
      />
      <div className="flex gap-2">
        <Link href="/admin/verifikasi-hasil" className={kelasTab(tab !== "riwayat")}>
          Menunggu
        </Link>
        <Link href="/admin/verifikasi-hasil?tab=riwayat" className={kelasTab(tab === "riwayat")}>
          Riwayat
        </Link>
      </div>
      {tab === "riwayat" ? (
        <Kartu judul="Riwayat verifikasi">
          <Tabel kolom={["Program", "Keputusan", "Catatan", "Verifikator", "Waktu"]}>
            {riwayat.map((v) => (
              <tr key={v.id}>
                <td>
                  <Link href={`/admin/verifikasi-hasil/${v.monitoring.id}`} className="font-semibold text-laut hover:underline">
                    {v.monitoring.program.nama}
                  </Link>
                </td>
                <td>
                  <Lencana warna={WARNA_KEPUTUSAN_HASIL[v.keputusan]}>{LABEL_KEPUTUSAN_HASIL[v.keputusan]}</Lencana>
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
          <Tabel kolom={["Tanggal", "Program", "Pencatat", "Jenis", "Hidup", "Aksi"]} kosong="Tidak ada catatan yang menunggu">
            {menunggu.map((m) => (
              <tr key={m.id}>
                <td>{tanggal(m.tanggal)}</td>
                <td className="font-semibold">{m.program.nama}</td>
                <td>{m.pencatat.nama}</td>
                <td>{LABEL_JENIS_MONITORING[m.jenis]}</td>
                <td>
                  {m.jumlahHidup}/{m.jumlahDitanam} ({tingkatHidup(m.jumlahDitanam, m.jumlahHidup)}%)
                </td>
                <td>
                  <Link href={`/admin/verifikasi-hasil/${m.id}`} className="font-semibold text-laut hover:underline">
                    Nilai
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
