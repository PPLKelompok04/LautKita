import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormRole from "../FormRole";

export const metadata = { title: "Edit Role - LautKita" };

export default function EditRolePage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit Role" />
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
  const role = Number.isInteger(id) ? await prisma.role.findUnique({ where: { id } }) : null;
  if (!role) notFound();
  return <FormRole role={role} />;
}
