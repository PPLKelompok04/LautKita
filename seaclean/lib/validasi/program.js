import { z } from "zod";
import { angkaWajib, pilihan, tanggalWajib, teksWajib, urlFile } from "./umum";

export const LABEL_STATUS_PROGRAM = {
  DRAF: "Draf",
  SEGERA_HADIR: "Segera hadir",
  DIBUKA: "Pendaftaran dibuka",
  BERJALAN: "Berjalan",
  SELESAI: "Selesai",
};

export const LABEL_MONITORING = {
  MINGGUAN: "Setiap minggu",
  DUA_MINGGUAN: "Setiap 2 minggu",
  BULANAN: "Setiap bulan",
};

const bilanganPositif = (label) =>
  angkaWajib(label).pipe(z.number().int(`${label} harus bilangan bulat`).positive(`${label} harus lebih dari 0`));

export const programSchema = z
  .object({
    nama: teksWajib("Nama program", 3),
    penyelenggara: teksWajib("Penyelenggara", 3),
    lokasiId: angkaWajib("Lokasi").pipe(z.number().int("Lokasi wajib dipilih")),
    spesiesId: angkaWajib("Spesies").pipe(z.number().int("Spesies wajib dipilih")),
    deskripsi: teksWajib("Deskripsi program", 10),
    tanggalMulai: tanggalWajib("Tanggal mulai"),
    tanggalSelesai: tanggalWajib("Tanggal selesai"),
    batasPendaftaran: tanggalWajib("Batas pendaftaran"),
    waktuPenanaman: teksWajib("Waktu penanaman"),
    kuotaPeserta: bilanganPositif("Kapasitas peserta"),
    targetBibit: bilanganPositif("Target bibit"),
    pendamping: teksWajib("Pendamping", 3),
    monitoring: pilihan("Monitoring", Object.keys(LABEL_MONITORING)),
    persyaratan: teksWajib("Persyaratan peserta", 10),
    status: pilihan("Status program", Object.keys(LABEL_STATUS_PROGRAM)),
    fotoUrl: urlFile(),
  })
  .refine((d) => d.tanggalSelesai >= d.tanggalMulai, { message: "Tanggal selesai tidak boleh sebelum tanggal mulai" })
  .refine((d) => d.batasPendaftaran <= d.tanggalMulai, { message: "Batas pendaftaran harus sebelum tanggal mulai" });
