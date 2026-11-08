"use client";

import { useActionState } from "react";
import { kelasInput, PesanError } from "@/components/admin/Field";
import { TombolHapus, TombolSimpan } from "@/components/admin/Tombol";
import { hapusBibit, simpanBibit } from "./actions";

export default function FormBibit({ spesiesId, bibit }) {
  const [state, aksi] = useActionState(simpanBibit.bind(null, spesiesId, bibit?.id ?? null), {});
  const v = state.nilai ?? bibit ?? { satuan: "bibit" };

  return (
    <form action={aksi} className="flex flex-col gap-2 py-3">
      <PesanError pesan={state.pesan} />
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_6rem_6rem_auto] sm:items-center">
        <input name="nama" defaultValue={v.nama} placeholder="Nama / kode batch" className={kelasInput} />
        <input name="sumber" defaultValue={v.sumber ?? ""} placeholder="Sumber bibit" className={kelasInput} />
        <input name="stok" defaultValue={v.stok ?? ""} placeholder="Stok" className={kelasInput} />
        <input name="satuan" defaultValue={v.satuan} placeholder="Satuan" className={kelasInput} />
        <div className="flex items-center gap-3">
          <TombolSimpan kecil>{bibit ? "Simpan" : "Tambah"}</TombolSimpan>
          {bibit && <TombolHapus aksi={hapusBibit.bind(null, spesiesId, bibit.id)} konfirmasi={`Hapus batch "${bibit.nama}"?`} />}
        </div>
      </div>
    </form>
  );
}
