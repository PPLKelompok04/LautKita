import { z } from "zod";
import { centang, latitude, longitude, teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_STATUS_LAPORAN = {
  MENUNGGU: "Menunggu verifikasi",
  VALID: "Valid",
  DITOLAK: "Ditolak",
  DITINDAKLANJUTI: "Ditindaklanjuti",
  SELESAI: "Selesai",
};

export const WARNA_STATUS_LAPORAN = {
  MENUNGGU: "slate",
  VALID: "biru",
  DITOLAK: "merah",
  DITINDAKLANJUTI: "kuning",
  SELESAI: "hijau",
};

export const laporanSchema = z.object({
  kategoriId: z.coerce.number().int().positive("Kategori wajib dipilih"),
  judul: teksWajib("Judul", 5),
  deskripsi: teksWajib("Deskripsi", 10),
  alamat: teksOpsional(),
  latitude: latitude(),
  longitude: longitude(),
  fotoUrl: urlFile(),
  anonim: centang(),
});

export function namaPelapor(laporan) {
  return laporan.anonim ? "Anonim" : laporan.pelapor.nama;
}
