import { z } from "zod";
import { centang, pilihan, teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_JENIS_PENCEMARAN = {
  SAMPAH: "Sampah",
  LIMBAH: "Limbah",
  MINYAK: "Minyak",
  ALAT_TANGKAP_MERUSAK: "Alat Tangkap Merusak",
};

export const LABEL_KEPARAHAN = {
  RINGAN: "Tidak Parah",
  SEDANG: "Sedang",
  PARAH: "Parah",
};

// Warna bawaan titik peta sesuai proposal: hijau (tidak parah), kuning (sedang), merah (parah)
export const WARNA_KEPARAHAN = {
  RINGAN: "#16a34a",
  SEDANG: "#eab308",
  PARAH: "#dc2626",
};

export const kategoriPencemaranSchema = z.object({
  nama: teksWajib("Nama kategori", 3),
  jenis: pilihan("Jenis pencemaran", Object.keys(LABEL_JENIS_PENCEMARAN)),
  tingkatKeparahan: pilihan("Tingkat keparahan", Object.keys(LABEL_KEPARAHAN)),
  warnaPeta: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Warna peta harus format #RRGGBB"),
  deskripsi: teksOpsional(),
  ikonUrl: urlFile(),
  aktif: centang(),
});
