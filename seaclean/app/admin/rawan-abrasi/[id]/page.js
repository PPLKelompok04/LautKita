import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormRawanAbrasi from "../FormRawanAbrasi";

export const metadata = { title: "Edit Lokasi Rawan Abrasi - LautKita" };

export default function EditRawanAbrasiPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Lokasi Rawan Abrasi" />
      <Kartu>
        <Suspense fallback={<Memuat />}>
          <IsiForm params={params} />
        </Suspense>
      </Kartu>
    </div>
  );
}

async function IsiForm({ params }) {
  const id = Number((await params).id);
  const [wilayah, lokasi] = await Promise.all([
    daftarWilayah(),
    Number.isInteger(id) ? prisma.lokasiRawanAbrasi.findUnique({ where: { id } }) : null,
  ]);
  if (!lokasi) notFound();
  return <FormRawanAbrasi lokasi={lokasi} wilayah={opsiWilayah(wilayah)} />;
}
