"use client";

import { useActionState } from "react";
import { Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import PetaPilihLokasi from "@/components/PetaPilihLokasi";
import { LABEL_JENIS_KEGIATAN, LABEL_STATUS_KEGIATAN } from "@/lib/validasi/kegiatan";
import { isiTanggalJam } from "@/lib/validasi/umum";
import { simpanKegiatan } from "./actions";

export default function FormKegiatan({ kegiatan, wilayah }) {
  const [state, aksi] = useActionState(simpanKegiatan.bind(null, kegiatan?.id ?? null), {});
  const v = state.nilai ?? { ...kegiatan, status: kegiatan?.status ?? "DIBUKA", tanggal: isiTanggalJam(kegiatan?.tanggal) };

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Judul kegiatan" name="judul" defaultValue={v.judul} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Jenis kegiatan" name="jenis" defaultValue={v.jenis} opsi={LABEL_JENIS_KEGIATAN} kosong="Pilih jenis" />
        <Input label="Tanggal & jam (WIB)" name="tanggal" type="datetime-local" defaultValue={v.tanggal} required />
        <Input label="Kuota peserta" name="kuota" type="number" min="1" defaultValue={v.kuota ?? ""} required />
        <Select label="Status" name="status" defaultValue={v.status} opsi={LABEL_STATUS_KEGIATAN} />
      </div>
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nama lokasi" name="namaLokasi" defaultValue={v.namaLokasi} placeholder="mis. Pantai Pangandaran" required />
        <Select label="Wilayah" name="wilayahId" defaultValue={v.wilayahId ?? ""} opsi={wilayah} kosong="(tidak dipilih)" />
      </div>
      <PetaPilihLokasi defaultLat={v.latitude} defaultLng={v.longitude} />
      <InputFile name="fotoUrl" label="Foto / poster kegiatan" folder="kegiatan" defaultValue={v.fotoUrl} />
      <AksiForm batal="/admin/kegiatan" />
    </form>
  );
}
