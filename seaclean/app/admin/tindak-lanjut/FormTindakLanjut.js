"use client";

import { useActionState } from "react";
import { PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { selesaikanTindakLanjut, tugaskanPetugas } from "./actions";

export function FormPenugasan({ laporanId, petugas }) {
  // `n` naik tiap kali server membalas, form dipasang ulang biar pilihan <select> tidak hilang
  const [state, aksi] = useActionState(
    async (prev, formData) => ({ ...(await tugaskanPetugas(laporanId, prev, formData)), n: (prev.n ?? 0) + 1 }),
    {}
  );
  const v = state.nilai ?? {};

  return (
    <form key={state.n ?? 0} action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Select label="Petugas lapangan" name="petugasId" defaultValue={v.petugasId ?? ""} opsi={petugas} kosong="Pilih petugas" required />
      <Textarea label="Instruksi" name="instruksi" defaultValue={v.instruksi ?? ""} placeholder="mis. Koordinasi dengan DLH, bawa karung sampah" />
      <AksiForm batal="/admin/tindak-lanjut" simpan="Tugaskan" />
    </form>
  );
}

export function FormPenanganan({ laporanId }) {
  const [state, aksi] = useActionState(selesaikanTindakLanjut.bind(null, laporanId), {});
  const v = state.nilai ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Textarea
        label="Catatan penanganan"
        name="catatanPenanganan"
        defaultValue={v.catatanPenanganan}
        placeholder="Apa yang sudah dilakukan di lokasi"
        keterangan="Catatan ini dikirim ke pelapor."
        required
      />
      <InputFile name="buktiUrl" label="Foto bukti penanganan" folder="tindak-lanjut" defaultValue={v.buktiUrl} wajib />
      <AksiForm batal="/admin/tindak-lanjut" simpan="Tandai selesai" />
    </form>
  );
}
