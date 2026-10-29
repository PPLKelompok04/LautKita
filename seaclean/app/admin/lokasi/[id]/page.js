import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormLokasi from "../FormLokasi";
import FormZona from "./FormZona";

export const metadata = { title: "Edit Lokasi - LautKita" };

export default function EditLokasiPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Lokasi Budidaya" />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman params={params} />
      </Suspense>
    </div>
  );
}

async function IsiHalaman({ params }) {
  const id = Number((await params).id);
  const [wilayah, lokasi] = await Promise.all([
    daftarWilayah(),
    Number.isInteger(id)
      ? prisma.lokasiBudidaya.findUnique({ where: { id }, include: { zona: { orderBy: { id: "asc" } } } })
      : null,
  ]);
  if (!lokasi) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Kartu>
        <FormLokasi lokasi={lokasi} wilayah={opsiWilayah(wilayah)} />
      </Kartu>
      <Kartu>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Zona</h2>
        <p className="mb-4 text-sm text-slate-500">Pembagian area di dalam lokasi ini.</p>
        <div className="flex flex-col divide-y divide-slate-100">
          {lokasi.zona.map((z) => (
            <FormZona key={z.id} lokasiId={lokasi.id} zona={z} />
          ))}
          <FormZona lokasiId={lokasi.id} />
        </div>
      </Kartu>
    </div>
  );
}
