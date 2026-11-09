"use client";

import { useActionState } from "react";
import { PesanError, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import { LABEL_KEPUTUSAN_HASIL } from "@/lib/validasi/verifikasiHasil";
import { verifikasiHasil } from "./actions";

export default function FormVerifikasiHasil({ monitoringId }) {
  const [state, aksi] = useActionState(verifikasiHasil.bind(null, monitoringId), {});
  const v = state.nilai ?? {};

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <fieldset className="flex flex-wrap gap-4">
        <legend className="pb-1 text-[13px] font-semibold text-teks">Keputusan *</legend>
        {Object.entries(LABEL_KEPUTUSAN_HASIL).map(([nilai, label]) => (
          <label key={nilai} className="flex items-center gap-2 text-sm text-teks">
            <input type="radio" name="keputusan" value={nilai} defaultChecked={v.keputusan === nilai} className="size-4 accent-laut" required />
            {label}
          </label>
        ))}
      </fieldset>
      <Textarea
        label="Catatan"
        name="catatan"
        defaultValue={v.catatan}
        placeholder="mis. Foto kurang jelas, mohon foto ulang dari dekat"
        keterangan="Dikirim ke pencatat lewat notifikasi."
        required
      />
      <AksiForm batal="/admin/verifikasi-hasil" simpan="Simpan verifikasi" />
    </form>
  );
}
