"use client";

import { useActionState } from "react";
import { kelasInput, PesanError } from "@/components/admin/Field";
import { TombolHapus, TombolSimpan } from "@/components/admin/Tombol";
import { hapusZona, simpanZona } from "../actions";

// Satu baris zona (edit), atau baris kosong untuk tambah zona kalau `zona` tidak diisi.
export default function FormZona({ lokasiId, zona }) {
  const [state, aksi] = useActionState(simpanZona.bind(null, lokasiId, zona?.id ?? null), {});
  // Form tambah dikosongkan lagi setelah berhasil, form edit tetap menampilkan data tersimpan.
  const v = state.nilai ?? zona ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-2 py-3">
      <PesanError pesan={state.pesan} />
      <div className="grid gap-2 sm:grid-cols-[1fr_8rem_1fr_auto] sm:items-center">
        <input name="nama" defaultValue={v.nama} placeholder="Nama zona" className={kelasInput} />
        <input name="luasM2" defaultValue={v.luasM2 ?? ""} placeholder="Luas (m²)" className={kelasInput} />
        <input name="keterangan" defaultValue={v.keterangan ?? ""} placeholder="Keterangan" className={kelasInput} />
        <div className="flex items-center gap-3">
          <TombolSimpan kecil>{zona ? "Simpan" : "Tambah"}</TombolSimpan>
          {zona && <TombolHapus aksi={hapusZona.bind(null, lokasiId, zona.id)} konfirmasi={`Hapus zona "${zona.nama}"?`} />}
        </div>
      </div>
    </form>
  );
}
