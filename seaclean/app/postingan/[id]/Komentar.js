"use client";

import { useActionState, useState } from "react";
import { CornerDownRight } from "lucide-react";
import { kelasInput, PesanError } from "@/components/admin/Field";
import { TombolHapus, TombolSimpan } from "@/components/admin/Tombol";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { hapusKomentar, tambahKomentar } from "../actions";

export function FormKomentar({ postinganId, parentId = null, onSelesai }) {
  const [state, aksi] = useActionState(async (prev, formData) => {
    const hasil = await tambahKomentar(postinganId, parentId, prev, formData);
    if (!hasil?.ok) return { ...hasil, kirim: prev.kirim };
    onSelesai?.();
    return { kirim: (prev.kirim ?? 0) + 1 };
  }, {});

  return (
    // key baru tiap terkirim biar textarea kosong lagi
    <form key={state.kirim ?? 0} action={aksi} className="flex flex-col gap-2">
      <PesanError pesan={state.pesan} />
      <div className="flex gap-2">
        <textarea name="isi" rows={parentId ? 1 : 2} placeholder={parentId ? "Tulis balasan..." : "Tulis komentar..."} className={kelasInput} required />
        <TombolSimpan kecil>Kirim</TombolSimpan>
      </div>
    </form>
  );
}

export function ItemKomentar({ komentar: k, postinganId, userId, bisaHapusSemua }) {
  const [balas, setBalas] = useState(false);
  const bisaHapus = (x) => bisaHapusSemua || x.userId === userId;

  return (
    <div className="flex flex-col gap-2 py-3">
      <Isi k={k} bisaHapus={bisaHapus(k)} />
      <button type="button" onClick={() => setBalas(!balas)} className="w-fit pl-1 text-[11px] font-semibold text-laut hover:underline">
        Balas
      </button>
      <div className="flex flex-col gap-2 border-l-2 border-garis pl-4">
        {k.balasan.map((b) => (
          <div key={b.id} className="flex gap-1.5">
            <CornerDownRight size={14} className="mt-1 shrink-0 text-redup" />
            <Isi k={b} bisaHapus={bisaHapus(b)} />
          </div>
        ))}
        {balas && <FormKomentar postinganId={postinganId} parentId={k.id} onSelesai={() => setBalas(false)} />}
      </div>
    </div>
  );
}

function Isi({ k, bisaHapus }) {
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <p className="text-xs">
        <span className="font-semibold text-teks">{k.user.nama}</span> <span className="text-redup">· {tampilTanggalJam(k.createdAt)}</span>
      </p>
      <p className="whitespace-pre-line text-sm text-teks">{k.isi}</p>
      {bisaHapus && (
        <div>
          <TombolHapus aksi={hapusKomentar.bind(null, k.id)} konfirmasi="Hapus komentar ini?" className="text-[11px] font-semibold text-red-600 hover:underline" />
        </div>
      )}
    </div>
  );
}
