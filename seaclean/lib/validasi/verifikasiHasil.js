import { z } from "zod";
import { pilihan, teksWajib } from "./umum";

export const LABEL_KEPUTUSAN_HASIL = { DITERIMA: "Diterima", REVISI: "Perlu revisi", DITOLAK: "Ditolak" };

export const WARNA_KEPUTUSAN_HASIL = { DITERIMA: "hijau", REVISI: "kuning", DITOLAK: "merah" };

export const verifikasiHasilSchema = z.object({
  keputusan: pilihan("Keputusan", Object.keys(LABEL_KEPUTUSAN_HASIL)),
  catatan: teksWajib("Catatan", 5),
});
