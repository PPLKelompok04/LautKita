"use server";

import { createClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth";

// Upload file langsung dari browser ke Supabase Storage pakai signed URL,
// supaya file besar tidak lewat server (batas body Vercel 4,5 MB).
// Server hanya memvalidasi jenis & ukuran lalu membuat URL upload sekali pakai.

const MB = 1024 * 1024;

const ATURAN = {
  foto: { tipe: ["image/jpeg", "image/png"], maks: 5 * MB, pesan: "Foto harus JPG/PNG maksimal 5 MB" },
  dokumen: { tipe: ["application/pdf"], maks: 10 * MB, pesan: "Dokumen harus PDF maksimal 10 MB" },
};

const EKSTENSI = { "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf" };

export async function buatUrlUpload({ jenis, folder, tipe, ukuran }) {
  await requireRole();

  const aturan = ATURAN[jenis];
  if (!aturan) return { pesan: "Jenis file tidak dikenal" };
  if (!aturan.tipe.includes(tipe) || ukuran > aturan.maks) return { pesan: aturan.pesan };
  if (!/^[a-z0-9-]+$/.test(folder)) return { pesan: "Folder tidak valid" };

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const bucket = supabase.storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET);
  const path = `${folder}/${crypto.randomUUID()}.${EKSTENSI[tipe]}`;

  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error) return { pesan: "Gagal menyiapkan upload, coba lagi" };

  return { path, token: data.token, url: bucket.getPublicUrl(path).data.publicUrl };
}
