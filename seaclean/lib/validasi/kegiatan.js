import { z } from "zod";
import { angkaWajib, idOpsional, latitude, longitude, pilihan, tanggalJamWajib, teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_JENIS_KEGIATAN = {
  BERSIH_PANTAI: "Bersih Pantai",
  TANAM_MANGROVE: "Tanam Mangrove",
  TRANSPLANTASI_KARANG: "Transplantasi Karang",
  EDUKASI: "Edukasi",
  LAINNYA: "Lainnya",
};

export const LABEL_STATUS_KEGIATAN = {
  DIBUKA: "Pendaftaran Dibuka",
  PENUH: "Kuota Penuh",
  DITUTUP: "Pendaftaran Ditutup",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

export const kegiatanSchema = z.object({
  judul: teksWajib("Judul", 5),
  jenis: pilihan("Jenis kegiatan", Object.keys(LABEL_JENIS_KEGIATAN)),
  deskripsi: teksOpsional(),
  tanggal: tanggalJamWajib("Tanggal & jam kegiatan"),
  wilayahId: idOpsional("Wilayah"),
  namaLokasi: teksWajib("Nama lokasi"),
  latitude: latitude(),
  longitude: longitude(),
  kuota: angkaWajib("Kuota").pipe(z.number().int("Kuota harus bilangan bulat").positive("Kuota harus lebih dari 0")),
  status: pilihan("Status", Object.keys(LABEL_STATUS_KEGIATAN)),
  fotoUrl: urlFile(),
});
