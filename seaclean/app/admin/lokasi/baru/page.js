import { Suspense } from "react";
import { connection } from "next/server";
import { Judul, Kartu, Memuat } from "@/components/admin/Halaman";
import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";
import FormLokasi from "../FormLokasi";

export const metadata = { title: "Tambah Lokasi - LautKita" };

export default function TambahLokasiPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Lokasi Budidaya" />
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
  return <FormLokasi wilayah={opsiWilayah(await daftarWilayah())} />;
}
