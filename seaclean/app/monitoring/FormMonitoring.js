"use client";

import { useActionState } from "react";
import { Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { LABEL_JENIS_MONITORING } from "@/lib/validasi/monitoring";
import { isiTanggal } from "@/lib/validasi/umum";
import { simpanMonitoring } from "./actions";

export default function FormMonitoring({ monitoring, program }) {
  // `n` naik tiap kali server membalas, form dipasang ulang biar pilihan <select> tidak hilang
  const [state, aksi] = useActionState(
    async (prev, formData) => ({ ...(await simpanMonitoring(monitoring?.id ?? null, prev, formData)), n: (prev.n ?? 0) + 1 }),
    {}
  );
  const v = state.nilai ?? { ...monitoring, tanggal: isiTanggal(monitoring?.tanggal ?? new Date()) };

  return (
    <form key={state.n ?? 0} action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Program" name="programId" defaultValue={v.programId ?? ""} opsi={program} kosong="Pilih program" required />
        <Select label="Jenis catatan" name="jenis" defaultValue={v.jenis ?? "PEMANTAUAN"} opsi={LABEL_JENIS_MONITORING} />
        <Input label="Tanggal" name="tanggal" type="date" defaultValue={v.tanggal} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Jumlah ditanam" name="jumlahDitanam" type="number" min="1" defaultValue={v.jumlahDitanam ?? ""} required />
          <Input label="Jumlah hidup" name="jumlahHidup" type="number" min="0" defaultValue={v.jumlahHidup ?? ""} required />
        </div>
      </div>
      <Textarea label="Catatan" name="catatan" defaultValue={v.catatan ?? ""} placeholder="Kondisi air, hama, cuaca, dsb." />
      <InputFile name="fotoUrl" label="Foto kondisi" folder="monitoring" defaultValue={v.fotoUrl} />
      <AksiForm batal="/monitoring" simpan={monitoring ? "Kirim ulang" : "Simpan catatan"} />
    </form>
  );
}
