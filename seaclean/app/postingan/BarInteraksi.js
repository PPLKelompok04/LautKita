"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, Link2, MessageCircle, Repeat2 } from "lucide-react";
import { bagikanPostingan, toggleSuka } from "./actions";

const kelasDasar = "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold hover:bg-latar disabled:opacity-60";
const kelasTombol = `${kelasDasar} text-redup`;

export default function BarInteraksi({ postingan: p }) {
  const [pending, startTransition] = useTransition();
  const [bagikan, setBagikan] = useState(false);
  const [keterangan, setKeterangan] = useState("");
  const [tersalin, setTersalin] = useState(false);
  const { suka, komentar, bagikan: jumlahBagikan, sudahSuka, sudahBagikan } = p.interaksi;

  // sudah dibagikan -> klik membatalkan; belum -> buka kolom keterangan
  function klikBagikan() {
    if (!sudahBagikan) return setBagikan(!bagikan);
    if (confirm("Batalkan bagikan postingan ini?")) jalankan(() => bagikanPostingan(p.id));
  }

  function jalankan(aksi, lalu) {
    startTransition(async () => {
      const hasil = await aksi();
      if (hasil?.pesan) return alert(hasil.pesan);
      lalu?.();
    });
  }

  async function salinLink() {
    await navigator.clipboard.writeText(`${location.origin}/postingan/${p.id}`);
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-garis pt-2">
      <div className="flex flex-wrap gap-1">
        <button type="button" disabled={pending} onClick={() => jalankan(() => toggleSuka(p.id))} className={sudahSuka ? `${kelasDasar} text-red-600` : kelasTombol}>
          <Heart size={16} fill={sudahSuka ? "currentColor" : "none"} />
          {suka}
        </button>
        <Link href={`/postingan/${p.id}`} className={kelasTombol}>
          <MessageCircle size={16} />
          {komentar}
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={klikBagikan}
          title={sudahBagikan ? "Batalkan bagikan" : "Bagikan"}
          className={sudahBagikan ? `${kelasDasar} text-green-600` : kelasTombol}
        >
          <Repeat2 size={16} />
          {jumlahBagikan}
        </button>
        <button type="button" onClick={salinLink} className={kelasTombol}>
          <Link2 size={16} />
          {tersalin ? "Link tersalin" : "Salin link"}
        </button>
      </div>
      {bagikan && !sudahBagikan && (
        <div className="flex gap-2">
          <input
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            maxLength={280}
            placeholder="Tambahkan keterangan (opsional)"
            className="min-h-9 flex-1 rounded-[10px] border border-garis px-3 text-xs outline-none focus:border-laut"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              jalankan(
                () => bagikanPostingan(p.id, keterangan),
                () => {
                  setBagikan(false);
                  setKeterangan("");
                }
              )
            }
            className="rounded-[10px] bg-laut px-3 text-xs font-semibold text-white disabled:opacity-60"
          >
            Bagikan
          </button>
        </div>
      )}
    </div>
  );
}
