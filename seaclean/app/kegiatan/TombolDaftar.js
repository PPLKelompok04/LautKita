"use client";

import { useTransition } from "react";
import { batalDaftar, daftarKegiatan } from "./actions";

export default function TombolDaftar({ kegiatanId, terdaftar, bisaDaftar }) {
  const [pending, startTransition] = useTransition();

  function klik() {
    if (terdaftar && !confirm("Batalkan pendaftaran kegiatan ini?")) return;
    startTransition(async () => {
      const hasil = terdaftar ? await batalDaftar(kegiatanId) : await daftarKegiatan(kegiatanId);
      if (hasil?.pesan) alert(hasil.pesan);
    });
  }

  if (!terdaftar && !bisaDaftar) {
    return <span className="text-xs font-semibold text-redup">Pendaftaran ditutup</span>;
  }

  return (
    <button
      type="button"
      onClick={klik}
      disabled={pending}
      className={
        terdaftar
          ? "rounded-[10px] border border-garis bg-white px-4 py-2 text-xs font-semibold text-red-600 hover:bg-latar disabled:opacity-60"
          : "rounded-[10px] bg-laut px-4 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
      }
    >
      {pending ? "Memproses..." : terdaftar ? "Batal daftar" : "Daftar"}
    </button>
  );
}
