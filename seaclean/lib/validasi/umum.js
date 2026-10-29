import { z } from "zod";

// Helper validasi untuk data dari <form> (FormData selalu berisi string).
// String kosong dianggap "tidak diisi".

const kosong = (v) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");

export const teksWajib = (label, min = 1) =>
  z
    .string({ message: `${label} wajib diisi` })
    .trim()
    .min(min, min > 1 ? `${label} minimal ${min} karakter` : `${label} wajib diisi`);

export const teksOpsional = () =>
  z.preprocess((v) => (kosong(v) ? null : v), z.string().trim().nullable());

export const angkaWajib = (label) =>
  z.preprocess((v) => (kosong(v) ? undefined : Number(v)), z.number({ message: `${label} harus diisi angka` }));

export const angkaOpsional = (label) =>
  z.preprocess((v) => (kosong(v) ? null : Number(v)), z.number({ message: `${label} harus angka` }).nullable());

// Untuk <select> relasi yang boleh kosong, mis. wilayah
export const idOpsional = (label) =>
  angkaOpsional(label).pipe(z.number().int(`${label} tidak valid`).nullable());

export const latitude = () =>
  angkaWajib("Latitude").pipe(z.number().min(-90, "Latitude minimal -90").max(90, "Latitude maksimal 90"));

export const longitude = () =>
  angkaWajib("Longitude").pipe(z.number().min(-180, "Longitude minimal -180").max(180, "Longitude maksimal 180"));

export const tanggalWajib = (label) =>
  z.preprocess((v) => (kosong(v) ? undefined : new Date(v)), z.date({ message: `${label} wajib diisi` }));

export const tanggalOpsional = (label) =>
  z.preprocess((v) => (kosong(v) ? null : new Date(v)), z.date({ message: `${label} tidak valid` }).nullable());

// Dari <input type="datetime-local">, dianggap jam WIB supaya hasilnya sama di laptop maupun server Vercel (UTC)
export const tanggalJamWajib = (label) =>
  z.preprocess(
    (v) => (kosong(v) ? undefined : new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? `${v}:00+07:00` : v)),
    z.date({ message: `${label} wajib diisi` })
  );

export const centang =() => z.preprocess((v) => v === "on" || v === "true", z.boolean());

export const pilihan = (label, nilai) =>
  z.enum(nilai, { message: `${label} wajib dipilih` });

// URL file hasil upload komponen <InputFile>. Hanya menerima file dari storage Supabase milik proyek.
export const urlFile = () =>
  z.preprocess(
    (v) => (kosong(v) ? null : v),
    z
      .string()
      .refine((v) => v.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`), "File tidak valid")
      .nullable()
  );

// Validasi FormData dengan schema zod.
// Hasil: { data } kalau valid, atau { pesan, nilai } kalau tidak (nilai dikembalikan ke form
// supaya isian user tidak hilang).
export function validasi(schema, formData) {
  const hasil = schema.safeParse(Object.fromEntries(formData));
  if (!hasil.success) return gagal(hasil.error.issues[0].message, formData);
  return { data: hasil.data };
}

export function gagal(pesan, formData) {
  const nilai = {};
  for (const [k, v] of formData ?? []) {
    if (typeof v === "string" && !k.startsWith("$") && !k.toLowerCase().includes("password")) nilai[k] = v;
  }
  return { pesan, nilai };
}

// Ubah error Prisma yang umum jadi pesan yang bisa dibaca user.
export function pesanErrorPrisma(e) {
  if (e?.code === "P2002") return "Data dengan nilai yang sama sudah ada";
  if (e?.code === "P2003") return "Data masih dipakai oleh data lain, jadi tidak bisa dihapus";
  if (e?.code === "P2025") return "Data tidak ditemukan";
  throw e;
}

// Format tanggal untuk <input type="date">
export function isiTanggal(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

// Format tanggal + jam (WIB) untuk <input type="datetime-local">
export function isiTanggalJam(d) {
  if (!d) return "";
  return new Date(new Date(d).getTime() + 7 * 3600000).toISOString().slice(0, 16);
}

// Tampilan tanggal + jam WIB, mis. "29 Okt 2026, 08.00"
export function tampilTanggalJam(d) {
  return new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" });
}
