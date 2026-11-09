"use client";

import { useActionState } from "react";
import { PesanError, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import { LABEL_KEPUTUSAN } from "@/lib/validasi/verifikasiLaporan";
import { verifikasiLaporan } from "./actions";

export default function FormVerifikasi({ laporanId }) {
  const [state, aksi] = useActionState(verifikasiLaporan.bind(null, laporanId), {});
  const v = state.nilai ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <fieldset className="flex flex-col gap-2">
        <legend className="pb-1 text-[13px] font-semibold text-teks">Keputusan *</legend>
        {Object.entries(LABEL_KEPUTUSAN).map(([nilai, label]) => (
          <label key={nilai} className="flex items-center gap-2 text-sm text-teks">
            <input type="radio" name="keputusan" value={nilai} defaultChecked={v.keputusan === nilai} className="size-4 accent-laut" required />
            {label}
          </label>
        ))}
      </fieldset>
      <Textarea
        label="Catatan verifikator"
        name="catatan"
        defaultValue={v.catatan}
        placeholder="mis. Foto dan titik lokasi sesuai, sudah dicek ke lapangan"
        keterangan="Catatan ini dikirim ke pelapor lewat notifikasi."
        required
      />
      <AksiForm batal="/admin/verifikasi-laporan" simpan="Simpan verifikasi" />
    </form>
  );
}
