import { Suspense } from "react";
import { connection } from "next/server";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import FormRawanAbrasi from "../FormRawanAbrasi";

export const metadata = { title: "Tambah Lokasi Rawan Abrasi - LautKita" };

export default function TambahRawanAbrasiPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Lokasi Rawan Abrasi" />
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
  return <FormRawanAbrasi wilayah={opsiWilayah(await daftarWilayah())} />;
}
