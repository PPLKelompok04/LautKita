import { z } from "zod";
import { angkaWajib, centang, idOpsional, teksOpsional, teksWajib, urlFile } from "./umum";

// role bawaan, jangan dihapus
export const ROLE_SISTEM = ["ADMIN", "PETUGAS", "RELAWAN"];

export const userSchema = z.object({
  nama: teksWajib("Nama", 3),
  email: z.email("Format email tidak valid").transform((v) => v.trim().toLowerCase()),
  noTelepon: teksOpsional().pipe(
    z.string().regex(/^[0-9+\-\s]{8,20}$/, "Nomor telepon tidak valid").nullable()
  ),
  roleId: angkaWajib("Role").pipe(z.number().int("Role wajib dipilih")),
  wilayahId: idOpsional("Wilayah"),
  aktif: centang(),
  fotoUrl: urlFile(),
  // waktu edit, password kosong = tidak diganti
  password: teksOpsional().pipe(z.string().min(8, "Password minimal 8 karakter").nullable()),
});

export const roleSchema = z.object({
  kode: teksWajib("Kode")
    .transform((v) => v.toUpperCase())
    .pipe(z.string().regex(/^[A-Z_]+$/, "Kode hanya boleh huruf dan garis bawah")),
  nama: teksWajib("Nama", 3),
  deskripsi: teksOpsional(),
});
