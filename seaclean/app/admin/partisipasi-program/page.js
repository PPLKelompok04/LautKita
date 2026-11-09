import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CircleCheck, CircleX, Hourglass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Statistik, Tabel } from "@/components/admin/Halaman";
import { LABEL_STATUS_PESERTA, WARNA_STATUS_PESERTA } from "@/lib/validasi/pesertaProgram";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import TombolKeputusan from "./TombolKeputusan";

export const metadata = { title: "Peserta Program - LautKita" };

export default function PartisipasiProgramPage({ searchParams }) {
  return (
    <>
      <Judul judul="Peserta program budidaya" keterangan="PBI-14 · Setujui atau tolak anggota yang ingin bergabung ke program." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { status = "MENUNGGU" } = await searchParams;
  await connection();
  const filter = LABEL_STATUS_PESERTA[status] ? status : "MENUNGGU";

  const [data, jumlah] = await Promise.all([
    prisma.pesertaProgram.findMany({
      where: { status: filter },
      include: {
        user: { select: { nama: true, email: true } },
        program: { select: { nama: true, kuotaPeserta: true, _count: { select: { peserta: { where: { status: "DISETUJUI" } } } } } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.pesertaProgram.groupBy({ by: ["status"], _count: true }),
  ]);
  const n = (s) => jumlah.find((j) => j.status === s)?._count ?? 0;

  return (
    <>
      <Statistik
        data={[
          { label: "Menunggu persetujuan", nilai: n("MENUNGGU"), ikon: Hourglass, warna: "kuning" },
          { label: "Disetujui", nilai: n("DISETUJUI"), ikon: CircleCheck, warna: "hijau" },
          { label: "Ditolak", nilai: n("DITOLAK"), ikon: CircleX, warna: "merah" },
        ]}
      />
      <div className="flex gap-2">
        {Object.entries(LABEL_STATUS_PESERTA).map(([k, v]) => (
          <Link
            key={k}
            href={`/admin/partisipasi-program?status=${k}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${k === filter ? "bg-laut text-white" : "border border-garis bg-white text-teks"}`}
          >
            {v}
          </Link>
        ))}
      </div>
      <Kartu judul={LABEL_STATUS_PESERTA[filter]}>
        <Tabel kolom={["Anggota", "Program", "Motivasi", "Daftar", filter === "MENUNGGU" ? "Keputusan" : "Status"]} kosong="Tidak ada data">
          {data.map((p) => (
            <tr key={p.id}>
              <td>
                <p className="font-semibold">{p.user.nama}</p>
                <p className="text-redup">{p.user.email}</p>
              </td>
              <td>
                <p className="font-semibold">{p.program.nama}</p>
                <p className="text-redup">
                  {p.program._count.peserta}/{p.program.kuotaPeserta} disetujui
                </p>
              </td>
              <td className="max-w-64">{p.motivasi ?? "-"}</td>
              <td>{tampilTanggalJam(p.createdAt)}</td>
              <td>
                {filter === "MENUNGGU" ? (
                  <TombolKeputusan id={p.id} />
                ) : (
                  <>
                    <Lencana warna={WARNA_STATUS_PESERTA[p.status]}>{LABEL_STATUS_PESERTA[p.status]}</Lencana>
                    {p.catatan && <p className="pt-1 text-redup">{p.catatan}</p>}
                  </>
                )}
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={data.length} />
      </Kartu>
    </>
  );
}
