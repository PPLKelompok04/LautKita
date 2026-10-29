import { z } from "zod";
import { angkaOpsional, idOpsional, latitude, longitude, pilihan, teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_EKOSISTEM = {
  KARANG: "Terumbu Karang",
  IKAN: "Ikan",
  MANGROVE: "Mangrove",
};

export const lokasiSchema = z.object({
  nama: teksWajib("Nama", 3),
  ekosistem: pilihan("Ekosistem", Object.keys(LABEL_EKOSISTEM)),
  wilayahId: idOpsional("Wilayah"),
  deskripsi: teksOpsional(),
  latitude: latitude(),
  longitude: longitude(),
  fotoUrl: urlFile(),
});

export const zonaSchema = z.object({
  nama: teksWajib("Nama zona"),
  luasM2: angkaOpsional("Luas").pipe(z.number().positive("Luas harus lebih dari 0").nullable()),
  keterangan: teksOpsional(),
});

// Untuk API: lokasi sekaligus daftar zonanya
export const lokasiDenganZonaSchema = lokasiSchema.extend({
  zona: z.array(zonaSchema).optional().default([]),
});
