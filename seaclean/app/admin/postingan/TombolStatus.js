"use client";

import { useTransition } from "react";
import { ubahStatusPostingan } from "./actions";

export default function TombolStatus({ id, status }) {
  const [pending, startTransition] = useTransition();
  const tujuan = status === "TAMPIL" ? "DISEMBUNYIKAN" : "TAMPIL";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const hasil = await ubahStatusPostingan(id, tujuan);
          if (hasil?.pesan) alert(hasil.pesan);
        })
      }
      className="font-semibold text-laut hover:underline disabled:opacity-60"
    >
      {tujuan === "TAMPIL" ? "Tampilkan" : "Sembunyikan"}
    </button>
  );
}
