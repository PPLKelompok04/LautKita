import Link from "next/link";
import { Judul, Kartu } from "@/components/admin/Halaman";
import FormImport from "./FormImport";

export const metadata = { title: "Import Kategori Pencemaran - LautKita" };

export default function ImportKategoriPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-4">
      <Link href="/admin/kategori-pencemaran" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke kategori pencemaran
      </Link>
      <Judul judul="Import kategori dari CSV" keterangan="Tambahkan banyak kategori pencemaran sekaligus dari file CSV." />
      <Kartu>
        <FormImport />
      </Kartu>
    </div>
  );
}
