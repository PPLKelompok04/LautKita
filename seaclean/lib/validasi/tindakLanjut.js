import { z } from "zod";
import { teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_STATUS_TINDAK_LANJUT = { DITUGASKAN: "Sedang ditangani", SELESAI: "Selesai" };

export const penugasanSchema = z.object({
  petugasId: z.coerce.number().int().positive("Petugas wajib dipilih"),
  instruksi: teksOpsional(),
});

export const penangananSchema = z.object({
  catatanPenanganan: teksWajib("Catatan penanganan", 10),
  buktiUrl: urlFile().refine(Boolean, "Foto bukti penanganan wajib diunggah"),
});
