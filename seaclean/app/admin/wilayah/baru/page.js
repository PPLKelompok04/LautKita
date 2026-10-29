import { Judul, Kartu } from "@/components/admin/Halaman";
import FormWilayah from "../FormWilayah";

export const metadata = { title: "Tambah Wilayah - LautKita" };

export default function TambahWilayahPage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Wilayah" />
      <Kartu>
        <FormWilayah />
      </Kartu>
    </div>
  );
}
