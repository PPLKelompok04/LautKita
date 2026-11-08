import { z } from "zod";
import { teksWajib, urlFile } from "./umum";

export const LABEL_STATUS_POSTINGAN = {
  TAMPIL: "Tampil",
  DISEMBUNYIKAN: "Disembunyikan",
};

export const postinganSchema = z.object({
  isi: teksWajib("Isi postingan").pipe(z.string().max(2000, "Isi postingan maksimal 2000 karakter")),
  gambarUrl: urlFile(),
});

// ambil #tag dari isi, maks 10
export function ambilTag(isi) {
  const tag = [...isi.matchAll(/#([\p{L}\p{N}_]{2,40})/gu)].map((m) => m[1].toLowerCase());
  return [...new Set(tag)].slice(0, 10);
}
