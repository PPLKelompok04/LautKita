import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import FormUser from "../FormUser";

export const metadata = { title: "Tambah User - LautKita" };

export default function TambahUserPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah User" />
      <Kartu>
        <Suspense fallback={<Memuat />}>
          <IsiForm />
        </Suspense>
      </Kartu>
    </div>
  );
}

async function IsiForm() {
  await connection();
  const [roles, wilayah] = await Promise.all([prisma.role.findMany({ orderBy: { id: "asc" } }), daftarWilayah()]);
  return <FormUser roles={roles} wilayah={opsiWilayah(wilayah)} />;
}
