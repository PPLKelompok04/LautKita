"use client";

import { useActionState } from "react";
import { Input, PesanError } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import { simpanWilayah } from "./actions";

export default function FormWilayah({ wilayah }) {
  const [state, aksi] = useActionState(simpanWilayah.bind(null, wilayah?.id ?? null), {});
  const v = state.nilai ?? wilayah ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Nama wilayah (kecamatan/desa/pulau)" name="nama" defaultValue={v.nama} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Kabupaten/Kota" name="kabupatenKota" defaultValue={v.kabupatenKota} required />
        <Input label="Provinsi" name="provinsi" defaultValue={v.provinsi} required />
        <Input label="Latitude pusat (opsional)" name="latitude" defaultValue={v.latitude ?? ""} />
        <Input label="Longitude pusat (opsional)" name="longitude" defaultValue={v.longitude ?? ""} />
      </div>
      <AksiForm batal="/admin/wilayah" />
    </form>
  );
}
