"use client";

import { useActionState, useState } from "react";
import { Camera, SquarePen } from "lucide-react";
import { kelasInput, PesanError } from "@/components/admin/Field";
import { TombolSimpan } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { LABEL_KATEGORI_POSTINGAN } from "@/lib/validasi/postingan";
import { buatPostingan, ubahPostingan } from "./actions";

// `lokasi` = opsi wilayah { id: "Nama, Provinsi" }, `lokasiAwal` = wilayah profil penulis (bawaan tag lokasi)
export default function FormPostingan({ postingan, onSelesai, lokasi = {}, lokasiAwal }) {
  const [buka, setBuka] = useState(Boolean(postingan));
  const [state, aksi] = useActionState(async (prev, formData) => {
    const hasil = postingan ? await ubahPostingan(postingan.id, prev, formData) : await buatPostingan(prev, formData);
    // `n` naik tiap balasan supaya form dipasang ulang dan pilihan <select> tidak hilang saat gagal validasi
    if (!hasil?.ok) return { ...hasil, terkirim: prev.terkirim, n: (prev.n ?? 0) + 1 };
    onSelesai?.();
    setBuka(Boolean(postingan));
    return { terkirim: (prev.terkirim ?? 0) + 1, n: (prev.n ?? 0) + 1 };
  }, {});
  const v = state.nilai ?? postingan ?? { kategori: "UMUM", wilayahId: lokasiAwal ?? "" };

  if (!buka) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-garis bg-white p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-laut-muda text-laut">
          <Camera size={20} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-teks">Ada aksi di sekitarmu?</p>
          <p className="text-xs text-redup">Bagikan temuan atau progres pesisir</p>
        </div>
        <button
          type="button"
          onClick={() => setBuka(true)}
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-laut-muda px-3 py-2 text-sm font-semibold text-laut"
        >
          Tulis <SquarePen size={16} />
        </button>
      </div>
    );
  }

  const kelasPilih = "min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs text-teks";

  return (
    <form action={aksi} key={state.n ?? 0} className="flex flex-col gap-3 rounded-2xl border border-garis bg-white p-4">
      <PesanError pesan={state.pesan} />
      <textarea
        name="isi"
        rows={3}
        defaultValue={v.isi}
        placeholder="Ceritakan kegiatan atau temuanmu... gunakan #tag, mis. #mangrove"
        className={kelasInput}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-teks">
          Kategori
          <select name="kategori" defaultValue={v.kategori ?? "UMUM"} className={kelasPilih}>
            {Object.entries(LABEL_KATEGORI_POSTINGAN).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-teks">
          Lokasi
          <select name="wilayahId" defaultValue={v.wilayahId ?? ""} className={kelasPilih}>
            <option value="">(tanpa lokasi)</option>
            {Object.entries(lokasi).map(([id, nama]) => (
              <option key={id} value={id}>
                {nama}
              </option>
            ))}
          </select>
        </label>
      </div>
      <InputFile name="gambarUrl" label="Foto (opsional)" folder="postingan" defaultValue={v.gambarUrl} />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => (postingan ? onSelesai?.() : setBuka(false))}
          className="text-sm font-semibold text-redup hover:underline"
        >
          Batal
        </button>
        <TombolSimpan kecil>{postingan ? "Simpan" : "Posting"}</TombolSimpan>
      </div>
    </form>
  );
}
