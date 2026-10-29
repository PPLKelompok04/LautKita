import { z } from "zod";
import { angkaOpsional, teksWajib } from "./umum";

export const wilayahSchema = z.object({
  nama: teksWajib("Nama wilayah", 3),
  kabupatenKota: teksWajib("Kabupaten/kota", 3),
  provinsi: teksWajib("Provinsi", 3),
  latitude: angkaOpsional("Latitude").pipe(z.number().min(-90).max(90, "Latitude tidak valid").nullable()),
  longitude: angkaOpsional("Longitude").pipe(z.number().min(-180).max(180, "Longitude tidak valid").nullable()),
});
