import { Judul, Kartu } from "@/components/admin/Halaman";
import FormRole from "../FormRole";

export const metadata = { title: "Tambah Role - LautKita" };

export default function TambahRolePage() {
  return (
    <div className="max-w-2xl">
      <Judul judul="Tambah Role" />
      <Kartu>
        <FormRole />
      </Kartu>
    </div>
  );
}
