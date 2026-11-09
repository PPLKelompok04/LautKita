import { z } from "zod";
import { angkaWajib, pilihan, tanggalWajib, teksOpsional, urlFile } from "./umum";

export const LABEL_JENIS_MONITORING = { PENANAMAN: "Penanaman", TRANSPLANTASI: "Transplantasi", PEMANTAUAN: "Pemantauan berkala" };

export const LABEL_STATUS_MONITORING = { MENUNGGU: "Menunggu verifikasi", DITERIMA: "Diterima", DITOLAK: "Ditolak", REVISI: "Perlu revisi" };

export const WARNA_STATUS_MONITORING = { MENUNGGU: "slate", DITERIMA: "hijau", DITOLAK: "merah", REVISI: "kuning" };

const jumlah = (label) => angkaWajib(label).pipe(z.number().int(`${label} harus bilangan bulat`).min(0, `${label} tidak boleh minus`));

export const monitoringSchema = z
  .object({
    programId: z.coerce.number().int().positive("Program wajib dipilih"),
    jenis: pilihan("Jenis catatan", Object.keys(LABEL_JENIS_MONITORING)),
    tanggal: tanggalWajib("Tanggal").refine((d) => d <= new Date(), "Tanggal tidak boleh di masa depan"),
    jumlahDitanam: jumlah("Jumlah ditanam").pipe(z.number().positive("Jumlah ditanam harus lebih dari 0")),
    jumlahHidup: jumlah("Jumlah hidup"),
    catatan: teksOpsional(),
    fotoUrl: urlFile(),
  })
  .refine((d) => d.jumlahHidup <= d.jumlahDitanam, "Jumlah hidup tidak boleh melebihi jumlah ditanam");

// persen, dibulatkan 1 angka di belakang koma
export function tingkatHidup(ditanam, hidup) {
  return ditanam ? Math.round((hidup / ditanam) * 1000) / 10 : 0;
}
