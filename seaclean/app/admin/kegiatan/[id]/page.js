import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormKegiatan from "../FormKegiatan";

export const metadata = { title: "Edit Kegiatan - LautKita" };

export default function EditKegiatanPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Kegiatan Komunitas" />
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
  const [wilayah, kegiatan] = await Promise.all([
    daftarWilayah(),
    Number.isInteger(id) ? prisma.kegiatan.findUnique({ where: { id } }) : null,
  ]);
  if (!kegiatan) notFound();
  return <FormKegiatan kegiatan={kegiatan} wilayah={opsiWilayah(wilayah)} />;
}
