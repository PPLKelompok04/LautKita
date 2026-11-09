"use client";

import { useActionState, useState } from "react";
import { PesanError, Textarea } from "@/components/admin/Field";
import { TombolHapus, TombolSimpan } from "@/components/admin/Tombol";
import { batalGabung, gabungProgram } from "./actions";

export default function FormGabung({ programId, status }) {
  const [buka, setBuka] = useState(false);
  const [state, aksi] = useActionState(gabungProgram.bind(null, programId), {});

  if (status === "MENUNGGU") {
    return <TombolHapus aksi={batalGabung.bind(null, programId)} konfirmasi="Batalkan pendaftaran program ini?">Batalkan pendaftaran</TombolHapus>;
  }
  if (status) return null;

  if (!buka) {
    return (
      <button type="button" onClick={() => setBuka(true)} className="w-fit rounded-[10px] bg-laut px-4 py-2 text-xs font-semibold text-white hover:brightness-110">
        Gabung program
      </button>
    );
  }

  return (
    <form action={aksi} className="flex flex-col gap-2">
      <PesanError pesan={state.pesan} />
      <Textarea label="Motivasi (opsional)" name="motivasi" placeholder="Kenapa ingin ikut program ini?" />
      <div className="flex gap-2">
        <button type="button" onClick={() => setBuka(false)} className="rounded-[10px] border border-garis px-4 text-xs font-semibold text-laut">
          Batal
        </button>
        <TombolSimpan kecil>Kirim pendaftaran</TombolSimpan>
      </div>
    </form>
  );
}
