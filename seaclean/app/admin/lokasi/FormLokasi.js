"use client";

import { useActionState } from "react";
import { Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import PetaPilihLokasi from "@/components/PetaPilihLokasi";
import { LABEL_EKOSISTEM } from "@/lib/validasi/lokasi";
import { simpanLokasi } from "./actions";

// `wilayah` = opsi { id: "Nama, Provinsi" } dari opsiWilayah()
export default function FormLokasi({ lokasi, wilayah }) {
  const [state, aksi] = useActionState(simpanLokasi.bind(null, lokasi?.id ?? null), {});
  const v = state.nilai ?? lokasi ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Nama lokasi" name="nama" defaultValue={v.nama} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Ekosistem" name="ekosistem" defaultValue={v.ekosistem} opsi={LABEL_EKOSISTEM} kosong="Pilih ekosistem" />
        <Select label="Wilayah" name="wilayahId" defaultValue={v.wilayahId ?? ""} opsi={wilayah} kosong="(tidak dipilih)" />
      </div>
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi ?? ""} />
      <PetaPilihLokasi defaultLat={v.latitude} defaultLng={v.longitude} />
      <InputFile name="fotoUrl" label="Foto lokasi" folder="lokasi-budidaya" defaultValue={v.fotoUrl} />
      <AksiForm batal="/admin/lokasi" />
    </form>
  );
}
