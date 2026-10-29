import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormWilayah from "../FormWilayah";

export const metadata = { title: "Edit Wilayah - LautKita" };

export default function EditWilayahPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Wilayah" />
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
  const wilayah = Number.isInteger(id) ? await prisma.wilayah.findUnique({ where: { id } }) : null;
  if (!wilayah) notFound();
  return <FormWilayah wilayah={wilayah} />;
}
