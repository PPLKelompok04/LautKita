import { z } from "zod";
import { angkaOpsional, idOpsional, latitude, longitude, pilihan, tanggalWajib, teksOpsional, teksWajib, urlFile } from "./umum";

export const LABEL_KERAWANAN = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
};

const ukuran = (label) => angkaOpsional(label).pipe(z.number().min(0, `${label} tidak boleh minus`).nullable());

export const rawanAbrasiSchema = z.object({
  nama: teksWajib("Nama lokasi", 3),
  wilayahId: idOpsional("Wilayah"),
  latitude: latitude(),
  longitude: longitude(),
  tingkatKerawanan: pilihan("Tingkat kerawanan", Object.keys(LABEL_KERAWANAN)),
  panjangGarisPantaiM: ukuran("Panjang garis pantai"),
  lajuAbrasiMPerTahun: ukuran("Laju abrasi"),
  tanggalPendataan: tanggalWajib("Tanggal pendataan"),
  keterangan: teksOpsional(),
  fotoUrl: urlFile(),
});
