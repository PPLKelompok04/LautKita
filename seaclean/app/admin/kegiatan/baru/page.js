import { Suspense } from "react";
import { connection } from "next/server";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import FormKegiatan from "../FormKegiatan";

export const metadata = { title: "Tambah Kegiatan - LautKita" };

export default function TambahKegiatanPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Kegiatan Komunitas" />
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
  return <FormKegiatan wilayah={opsiWilayah(await daftarWilayah())} />;
}
