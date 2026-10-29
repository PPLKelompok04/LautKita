"use client";

import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Save } from "lucide-react";
import { kelasTombolKedua, kelasTombolUtama } from "./kelas";

export function TombolSimpan({ children = "Simpan perubahan", kecil }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={kecil ? `${kelasTombolUtama} min-h-[38px] px-4` : `${kelasTombolUtama} flex-1`}
    >
      {!kecil && <Save size={18} />}
      {pending ? "Menyimpan..." : children}
    </button>
  );
}

// Pasangan tombol Batal + Simpan di bawah form
export function AksiForm({ batal, simpan }) {
  return (
    <div className="flex gap-2">
      <Link href={batal} className={`${kelasTombolKedua} flex-1`}>
        Batal
      </Link>
      <TombolSimpan>{simpan}</TombolSimpan>
    </div>
  );
}

// `aksi` adalah Server Action tanpa argumen (sudah di-bind dengan id),
// boleh mengembalikan { pesan } kalau gagal.
export function TombolHapus({ aksi, konfirmasi = "Yakin ingin menghapus data ini?", children = "Hapus", className }) {
  const [pending, startTransition] = useTransition();

  function klik() {
    if (!confirm(konfirmasi)) return;
    startTransition(async () => {
      const hasil = await aksi();
      if (hasil?.pesan) alert(hasil.pesan);
    });
  }

  return (
    <button
      type="button"
      onClick={klik}
      disabled={pending}
      className={className ?? "text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"}
    >
      {pending ? "Menghapus..." : children}
    </button>
  );
}
