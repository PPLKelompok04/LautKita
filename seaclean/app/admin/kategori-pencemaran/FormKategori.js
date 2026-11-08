"use client";

import { useActionState } from "react";
import { Centang, Field, Input, kelasInput, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { LABEL_JENIS_PENCEMARAN, LABEL_KEPARAHAN, WARNA_KEPARAHAN } from "@/lib/validasi/kategoriPencemaran";
import { simpanKategori } from "./actions";

export default function FormKategori({ kategori }) {
  const [state, aksi] = useActionState(simpanKategori.bind(null, kategori?.id ?? null), {});
  const v = state.nilai ?? kategori ?? { aktif: true, tingkatKeparahan: "SEDANG", warnaPeta: WARNA_KEPARAHAN.SEDANG };

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Nama kategori" name="nama" defaultValue={v.nama} placeholder="mis. Pukat Harimau" required />
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Jenis" name="jenis" defaultValue={v.jenis} opsi={LABEL_JENIS_PENCEMARAN} kosong="Pilih jenis" />
        <Select
          label="Tingkat keparahan"
          name="tingkatKeparahan"
          defaultValue={v.tingkatKeparahan}
          opsi={LABEL_KEPARAHAN}
          onChange={(e) => {
            // Ikut ganti warna bawaan saat keparahan diganti
            e.currentTarget.form.warnaPeta.value = WARNA_KEPARAHAN[e.currentTarget.value];
          }}
        />
        <Field label="Warna titik di peta">
          <input type="color" name="warnaPeta" defaultValue={v.warnaPeta} className={`${kelasInput} h-10 p-1`} />
        </Field>
      </div>
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi ?? ""} />
      <InputFile name="ikonUrl" label="Ikon / foto contoh" folder="kategori-pencemaran" defaultValue={v.ikonUrl} />
      <Centang label="Aktif (bisa dipilih saat melapor)" name="aktif" defaultChecked={v.aktif === true || v.aktif === "on"} />
      <AksiForm batal="/admin/kategori-pencemaran" />
    </form>
  );
}
