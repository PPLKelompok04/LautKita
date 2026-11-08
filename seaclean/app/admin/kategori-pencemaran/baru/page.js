import { Judul, Kartu } from "@/components/admin/Halaman";
import FormKategori from "../FormKategori";

export const metadata = { title: "Tambah Kategori Pencemaran - LautKita" };

export default function TambahKategoriPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Kategori Pencemaran" />
      <Kartu>
        <FormKategori />
      </Kartu>
    </div>
  );
}
