"use client";

import { useState, useTransition } from "react";
import { putuskanPeserta } from "./actions";

export default function TombolKeputusan({ id }) {
  const [pending, startTransition] = useTransition();
  const [tolak, setTolak] = useState(false);
  const [alasan, setAlasan] = useState("");

  function kirim(setuju) {
    startTransition(async () => {
      const hasil = await putuskanPeserta(id, setuju, alasan);
      if (hasil?.pesan) alert(hasil.pesan);
    });
  }

  if (tolak) {
    return (
      <div className="flex flex-col gap-1.5">
        <input
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          placeholder="Alasan penolakan"
          className="min-w-44 rounded-lg border border-garis px-2 py-1 text-xs"
        />
        <div className="flex gap-1.5">
          <button type="button" disabled={pending} onClick={() => kirim(false)} className="text-[11px] font-semibold text-red-600 hover:underline">
            Kirim
          </button>
          <button type="button" onClick={() => setTolak(false)} className="text-[11px] font-semibold text-redup hover:underline">
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => kirim(true)}
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 disabled:opacity-60"
      >
        Setujui
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setTolak(true)}
        className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 disabled:opacity-60"
      >
        Tolak
      </button>
    </div>
  );
}
