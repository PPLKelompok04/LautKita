"use client";

import { useTransition } from "react";
import { ubahKehadiran } from "./actions";

export default function TombolKehadiran({ id, kehadiran }) {
  const [pending, startTransition] = useTransition();

  const tombol = (nilai, label, aktif) => (
    <button
      type="button"
      disabled={pending || kehadiran === nilai}
      onClick={() =>
        startTransition(async () => {
          const hasil = await ubahKehadiran(id, nilai);
          if (hasil?.pesan) alert(hasil.pesan);
        })
      }
      className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold disabled:cursor-default ${
        kehadiran === nilai ? aktif : "border-garis bg-white text-redup hover:bg-latar"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-1.5">
      {tombol("HADIR", "Hadir", "border-emerald-200 bg-emerald-50 text-emerald-700")}
      {tombol("TIDAK_HADIR", "Tidak hadir", "border-red-200 bg-red-50 text-red-700")}
    </div>
  );
}
