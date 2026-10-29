"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { buatUrlUpload } from "@/lib/upload";
import { kelasTombolKedua } from "@/components/admin/kelas";

let supabase;
function storage() {
  supabase ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET);
}

const ACCEPT = { foto: "image/jpeg,image/png", dokumen: "application/pdf" };
const KETERANGAN = { foto: "JPG/PNG · Maks. 5 MB", dokumen: "PDF · Maks. 10 MB" };

// Input upload file. File langsung diunggah ke Supabase saat dipilih,
// lalu URL-nya dikirim ke Server Action lewat input tersembunyi `name`.
export default function InputFile({ name, label, wajib, jenis = "foto", folder, defaultValue }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState("");

  async function pilihFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setStatus("Mengunggah...");
    const izin = await buatUrlUpload({ jenis, folder, tipe: file.type, ukuran: file.size });
    if (izin.pesan) return setStatus(izin.pesan);

    const { error } = await storage().uploadToSignedUrl(izin.path, izin.token, file, { contentType: file.type });
    if (error) return setStatus("Upload gagal, coba lagi");

    setUrl(izin.url);
    setStatus("");
  }

  return (
    <div className="flex items-center gap-2.5">
      <input type="hidden" name={name} value={url} />
      <div className="relative flex h-[116px] w-[142px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-garis bg-latar text-redup">
        {url && jenis === "foto" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="size-full object-cover" />
        ) : url ? (
          <a href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-xs text-laut underline">
            <FileText size={28} />
            Lihat PDF
          </a>
        ) : jenis === "foto" ? (
          <ImageIcon size={28} />
        ) : (
          <FileText size={28} />
        )}
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Hapus file"
            className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-red-600 shadow"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <span className="text-[13px] font-semibold text-teks">
          {label}
          {wajib && " *"}
        </span>
        <label className={`${kelasTombolKedua} w-full cursor-pointer`}>
          <Upload size={18} />
          {url ? "Ganti file" : jenis === "foto" ? "Pilih foto" : "Pilih dokumen"}
          <input type="file" accept={ACCEPT[jenis]} onChange={pilihFile} className="sr-only" />
        </label>
        <span className="text-[10px] text-redup">{status || KETERANGAN[jenis]}</span>
      </div>
    </div>
  );
}
