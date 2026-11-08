"use client";

import { useActionState } from "react";
import { Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import PetaPilihLokasi from "@/components/PetaPilihLokasi";
import { LABEL_KERAWANAN } from "@/lib/validasi/rawanAbrasi";
import { isiTanggal } from "@/lib/validasi/umum";
import { simpanRawanAbrasi } from "./actions";

export default function FormRawanAbrasi({ lokasi, wilayah }) {
  const [state, aksi] = useActionState(simpanRawanAbrasi.bind(null, lokasi?.id ?? null), {});
  const v = state.nilai ?? { ...lokasi, tanggalPendataan: isiTanggal(lokasi?.tanggalPendataan) };

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nama lokasi" name="nama" defaultValue={v.nama} required />
        <Select label="Wilayah" name="wilayahId" defaultValue={v.wilayahId ?? ""} opsi={wilayah} kosong="(tidak dipilih)" />
        <Select
          label="Tingkat kerawanan"
          name="tingkatKerawanan"
          defaultValue={v.tingkatKerawanan}
          opsi={LABEL_KERAWANAN}
          kosong="Pilih tingkat"
        />
        <Input label="Tanggal pendataan" name="tanggalPendataan" type="date" defaultValue={v.tanggalPendataan} required />
        <Input
          label="Panjang garis pantai (m)"
          name="panjangGarisPantaiM"
          type="number"
          step="any"
          min="0"
          defaultValue={v.panjangGarisPantaiM ?? ""}
        />
        <Input
          label="Laju abrasi (m/tahun)"
          name="lajuAbrasiMPerTahun"
          type="number"
          step="any"
          min="0"
          defaultValue={v.lajuAbrasiMPerTahun ?? ""}
        />
      </div>
      <PetaPilihLokasi defaultLat={v.latitude} defaultLng={v.longitude} />
      <Textarea label="Keterangan" name="keterangan" defaultValue={v.keterangan ?? ""} />
      <InputFile name="fotoUrl" label="Foto kondisi abrasi" folder="rawan-abrasi" defaultValue={v.fotoUrl} />
      <AksiForm batal="/admin/rawan-abrasi" />
    </form>
  );
}
