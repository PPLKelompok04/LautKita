import { Suspense } from "react";
import { connection } from "next/server";
import { Activity, HeartPulse, Sprout } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Statistik, Tabel } from "@/components/admin/Halaman";
import { LABEL_JENIS_MONITORING, LABEL_STATUS_MONITORING, WARNA_STATUS_MONITORING, tingkatHidup } from "@/lib/validasi/monitoring";

export const metadata = { title: "Monitoring Budidaya - LautKita" };

const tanggal = (d) => new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "UTC" });

export default function MonitoringAdminPage({ searchParams }) {
  return (
    <>
      <Judul judul="Monitoring budidaya" keterangan="PBI-15 · Rekap catatan penanaman dan tingkat hidup tiap program." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { program = "", status = "" } = await searchParams;
  await connection();
  const where = {
    ...(Number(program) ? { programId: Number(program) } : {}),
    ...(LABEL_STATUS_MONITORING[status] ? { status } : {}),
  };

  const [data, rekap, daftarProgram] = await Promise.all([
    prisma.monitoringBudidaya.findMany({
      where,
      include: { program: { select: { nama: true } }, pencatat: { select: { nama: true } } },
      orderBy: [{ tanggal: "desc" }, { id: "desc" }],
      take: 200,
    }),
    // data yang ditolak tidak dihitung
    prisma.monitoringBudidaya.groupBy({
      by: ["programId"],
      where: { status: { not: "DITOLAK" } },
      _sum: { jumlahDitanam: true, jumlahHidup: true },
      _count: true,
    }),
    prisma.programBudidaya.findMany({ orderBy: { nama: "asc" }, select: { id: true, nama: true } }),
  ]);

  const total = rekap.reduce((a, r) => ({ tanam: a.tanam + (r._sum.jumlahDitanam ?? 0), hidup: a.hidup + (r._sum.jumlahHidup ?? 0) }), { tanam: 0, hidup: 0 });
  const namaProgram = Object.fromEntries(daftarProgram.map((p) => [p.id, p.nama]));
  const kelasSelect = "min-h-[38px] rounded-[10px] border border-garis bg-white px-3 text-xs";

  return (
    <>
      <Statistik
        data={[
          { label: "Catatan monitoring", nilai: rekap.reduce((a, r) => a + r._count, 0), ikon: Activity },
          { label: "Total ditanam", nilai: total.tanam, ikon: Sprout, warna: "hijau" },
          { label: "Tingkat hidup rata-rata (%)", nilai: tingkatHidup(total.tanam, total.hidup), ikon: HeartPulse, warna: "ungu" },
        ]}
      />
      <Kartu judul="Rekap per program">
        <Tabel kolom={["Program", "Catatan", "Ditanam", "Hidup", "Tingkat hidup"]} kosong="Belum ada catatan">
          {rekap.map((r) => (
            <tr key={r.programId}>
              <td className="font-semibold">{namaProgram[r.programId]}</td>
              <td>{r._count}</td>
              <td>{r._sum.jumlahDitanam}</td>
              <td>{r._sum.jumlahHidup}</td>
              <td className="font-semibold">{tingkatHidup(r._sum.jumlahDitanam, r._sum.jumlahHidup)}%</td>
            </tr>
          ))}
        </Tabel>
      </Kartu>
      <Kartu judul="Semua catatan">
        <form action="/admin/monitoring" className="flex flex-wrap gap-2">
          <select name="program" defaultValue={program} className={kelasSelect}>
            <option value="">Semua program</option>
            {daftarProgram.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={status} className={kelasSelect}>
            <option value="">Semua status</option>
            {Object.entries(LABEL_STATUS_MONITORING).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button className="rounded-[10px] border border-garis bg-white px-4 text-xs font-semibold text-laut hover:bg-latar">Terapkan</button>
        </form>
        <Tabel kolom={["Tanggal", "Program", "Pencatat", "Jenis", "Hidup", "Status"]}>
          {data.map((m) => (
            <tr key={m.id}>
              <td>{tanggal(m.tanggal)}</td>
              <td className="font-semibold">{m.program.nama}</td>
              <td>{m.pencatat.nama}</td>
              <td>{LABEL_JENIS_MONITORING[m.jenis]}</td>
              <td>
                {m.jumlahHidup}/{m.jumlahDitanam} ({tingkatHidup(m.jumlahDitanam, m.jumlahHidup)}%)
              </td>
              <td>
                <Lencana warna={WARNA_STATUS_MONITORING[m.status]}>{LABEL_STATUS_MONITORING[m.status]}</Lencana>
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={data.length} />
      </Kartu>
    </>
  );
}
