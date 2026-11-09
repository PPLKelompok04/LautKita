import { z } from "zod";
import { pilihan, teksWajib } from "./umum";

export const LABEL_KEPUTUSAN = { VALID: "Valid, lanjut ditindaklanjuti", DITOLAK: "Tolak laporan" };

export const verifikasiSchema = z.object({
  keputusan: pilihan("Keputusan", Object.keys(LABEL_KEPUTUSAN)),
  catatan: teksWajib("Catatan verifikator", 5),
});
