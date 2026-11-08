import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormUser from "../FormUser";

export const metadata = { title: "Edit User - LautKita" };

export default function EditUserPage({ params }) {
  return (
    <div className="max-w-2xl">
      <Judul judul="Edit User" />
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
  const [roles, wilayah, user] = await Promise.all([
    prisma.role.findMany({ orderBy: { id: "asc" } }),
    daftarWilayah(),
    Number.isInteger(id)
      ? prisma.user.findUnique({ where: { id }, omit: { passwordHash: true } })
      : null,
  ]);
  if (!user) notFound();
  return <FormUser user={user} roles={roles} wilayah={opsiWilayah(wilayah)} />;
}
