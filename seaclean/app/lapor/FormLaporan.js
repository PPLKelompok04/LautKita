"use client";

import { useActionState } from "react";
import { Centang, Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import PetaPilihLokasi from "@/components/PetaPilihLokasi";
import { simpanLaporan } from "./actions";

export default function FormLaporan({ laporan, kategori }) {
  // `n` naik tiap kali server membalas, form dipasang ulang biar pilihan <select> tidak hilang
  const [state, aksi] = useActionState(
    async (prev, formData) => ({ ...(await simpanLaporan(laporan?.id ?? null, prev, formData)), n: (prev.n ?? 0) + 1 }),
    {}
  );
  const v = state.nilai ?? laporan ?? {};

  return (
    <form key={state.n ?? 0} action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Select label="Kategori pencemaran" name="kategoriId" defaultValue={v.kategoriId ?? ""} opsi={kategori} kosong="Pilih kategori" required />
      <Input label="Judul laporan" name="judul" defaultValue={v.judul} placeholder="mis. Tumpahan oli di dermaga" required />
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi} placeholder="Apa yang terlihat, sejak kapan, seberapa luas" required />
      <Input label="Patokan lokasi" name="alamat" defaultValue={v.alamat ?? ""} placeholder="mis. Dermaga timur Pantai Kenjeran" />
      <PetaPilihLokasi defaultLat={v.latitude} defaultLng={v.longitude} />
      <InputFile name="fotoUrl" label="Foto bukti" folder="laporan" defaultValue={v.fotoUrl} />
      <Centang label="Kirim sebagai anonim (nama tidak ditampilkan)" name="anonim" defaultChecked={v.anonim === true || v.anonim === "on"} />
      <AksiForm batal="/lapor" simpan={laporan ? "Simpan perubahan" : "Kirim laporan"} />
    </form>
  );
}
