import { z } from "zod";
import { angkaWajib, pilihan, teksOpsional, teksWajib, urlFile } from "./umum";
import { LABEL_EKOSISTEM } from "./lokasi";

// status IUCN
export const LABEL_STATUS_KONSERVASI = {
  LC: "LC · Risiko Rendah",
  VU: "VU · Rentan",
  EN: "EN · Terancam",
  CR: "CR · Kritis",
};

export const LABEL_STATUS_KATALOG = { true: "Aktif", false: "Nonaktif" };

// batas stok terbatas
export const BATAS_STOK_TERBATAS = 500;

export const spesiesSchema = z.object({
  namaLokal: teksWajib("Nama lokal", 3),
  namaIlmiah: teksWajib("Nama ilmiah", 3),
  ekosistem: pilihan("Kategori", Object.keys(LABEL_EKOSISTEM)),
  aktif: z.enum(["true", "false"], { message: "Status katalog wajib dipilih" }).transform((v) => v === "true"),
  statusKonservasi: pilihan("Status konservasi", Object.keys(LABEL_STATUS_KONSERVASI)),
  deskripsi: teksWajib("Deskripsi", 10),
  umurBibit: teksOpsional(),
  substrat: teksWajib("Substrat"),
  salinitas: teksWajib("Salinitas"),
  kondisiPerairan: teksWajib("Kondisi perairan"),
  caraMenanam: teksWajib("Cara menanam", 10),
  fotoUrl: urlFile(),
  dokumenUrl: urlFile(),
});

export const bibitSchema = z.object({
  nama: teksWajib("Nama bibit"),
  sumber: teksOpsional(),
  stok: angkaWajib("Stok").pipe(z.number().int("Stok harus bilangan bulat").min(0, "Stok tidak boleh minus")),
  satuan: teksWajib("Satuan"),
  keterangan: teksOpsional(),
});
