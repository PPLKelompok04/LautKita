import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormKategori from "../FormKategori";

export const metadata = { title: "Edit Kategori Pencemaran - LautKita" };

export default function EditKategoriPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Kategori Pencemaran" />
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
  const kategori = Number.isInteger(id) ? await prisma.kategoriPencemaran.findUnique({ where: { id } }) : null;
  if (!kategori) notFound();
  return <FormKategori kategori={kategori} />;
}
