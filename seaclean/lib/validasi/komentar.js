import { z } from "zod";
import { teksWajib } from "./umum";

export const komentarSchema = z.object({
  isi: teksWajib("Komentar").pipe(z.string().max(1000, "Komentar maksimal 1000 karakter")),
});
