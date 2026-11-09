import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Lencana, Memuat } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import { LABEL_JENIS_MONITORING, LABEL_STATUS_MONITORING, WARNA_STATUS_MONITORING, tingkatHidup } from "@/lib/validasi/monitoring";
import FormMonitoring from "./FormMonitoring";
import { opsiProgram } from "./program";

export const metadata = { title: "Monitoring Budidaya - LautKita" };

const tanggal = (d) => new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: "UTC" });

export default function MonitoringPage() {
  return (
    <HalamanAnggota judul="Monitoring budidaya" keterangan="Catat penanaman dan perkembangan budidaya di program yang kamu ikuti.">
      <Suspense fallback={<Memuat />}>
        <Isi />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi() {
  const session = await getSession();
  const [program, catatan] = await Promise.all([
    opsiProgram(session.user),
    prisma.monitoringBudidaya.findMany({
      where: { pencatatId: session.user.id },
      include: { program: { select: { nama: true } } },
      orderBy: [{ tanggal: "desc" }, { id: "desc" }],
    }),
  ]);

  return (
    <>
      {Object.keys(program).length ? (
        <Kartu judul="Catat monitoring">
          <FormMonitoring program={program} />
        </Kartu>
      ) : (
        <p className="rounded-2xl border border-garis bg-white p-4 text-sm text-redup">
          Kamu belum jadi peserta program mana pun.{" "}
          <Link href="/program" className="font-semibold text-laut hover:underline">
            Gabung program dulu
          </Link>
          , lalu tunggu disetujui admin.
        </p>
      )}
      <Kartu judul="Catatan saya" kanan={<span className="text-xs text-redup">{catatan.length} catatan</span>}>
        {catatan.length === 0 && <p className="pb-2 text-sm text-redup">Belum ada catatan.</p>}
        <div className="flex flex-col divide-y divide-garis">
          {catatan.map((m) => {
            const bisaUbah = ["MENUNGGU", "REVISI"].includes(m.status);
            const isi = (
              <>
                <div className="min-w-0">
                  <p className="text-[11px] text-redup">
                    {tanggal(m.tanggal)} · {LABEL_JENIS_MONITORING[m.jenis]}
                  </p>
                  <p className="truncate text-sm font-semibold text-teks">{m.program.nama}</p>
                  <p className="text-xs text-teks">
                    {m.jumlahHidup}/{m.jumlahDitanam} hidup · <span className="font-semibold">{tingkatHidup(m.jumlahDitanam, m.jumlahHidup)}%</span>
                  </p>
                </div>
                <Lencana warna={WARNA_STATUS_MONITORING[m.status]}>{LABEL_STATUS_MONITORING[m.status]}</Lencana>
              </>
            );
            return bisaUbah ? (
              <Link key={m.id} href={`/monitoring/${m.id}`} className="flex items-center justify-between gap-3 py-3 hover:bg-latar">
                {isi}
              </Link>
            ) : (
              <div key={m.id} className="flex items-center justify-between gap-3 py-3">
                {isi}
              </div>
            );
          })}
        </div>
      </Kartu>
    </>
  );
}
