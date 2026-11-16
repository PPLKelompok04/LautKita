"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAkses } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import {
  LABEL_JENIS_PENCEMARAN,
  LABEL_KEPARAHAN,
  WARNA_KEPARAHAN,
  kategoriPencemaranSchema,
} from "@/lib/validasi/kategoriPencemaran";

export async function simpanKategori(id, _state, formData) {
  await requireAkses("/admin/kategori-pencemaran");
  const { data, pesan, nilai } = validasi(kategoriPencemaranSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (id) await prisma.kategoriPencemaran.update({ where: { id }, data });
    else await prisma.kategoriPencemaran.create({ data });
  } catch (e) {
    if (e?.code === "P2002") return gagal("Nama kategori sudah ada", formData);
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/kategori-pencemaran");
}

// Import dari CSV (PBI-07). `baris` = array objek hasil baca CSV di browser, kolom:
// nama, jenis, tingkat_keparahan, warna_peta, deskripsi, aktif. Jenis & keparahan boleh kode (SAMPAH) atau label (Sampah).
// Tiap baris divalidasi dengan schema yang sama seperti form; nama yang sudah ada dilewati.
export async function importKategori(baris) {
  await requireAkses("/admin/kategori-pencemaran");
  if (!Array.isArray(baris) || baris.length === 0) return { pesan: "File CSV kosong" };
  if (baris.length > 500) return { pesan: "Maksimal 500 baris sekali import" };

  const kode = (label, nilai) => {
    const v = String(nilai ?? "").trim();
    const ketemu = Object.entries(label).find(([k, l]) => k.toLowerCase() === v.toLowerCase() || l.toLowerCase() === v.toLowerCase());
    return ketemu ? ketemu[0] : v.toUpperCase();
  };

  const sudahAda = new Set((await prisma.kategoriPencemaran.findMany({ select: { nama: true } })).map((k) => k.nama.toLowerCase()));
  const hasil = { dibuat: 0, dilewati: [], gagal: [] };

  for (const [i, b] of baris.entries()) {
    const nomor = i + 2; // baris 1 = judul kolom
    const keparahan = kode(LABEL_KEPARAHAN, b.tingkat_keparahan);
    const aktif = String(b.aktif ?? "ya").trim().toLowerCase();
    const cek = kategoriPencemaranSchema.safeParse({
      nama: b.nama,
      jenis: kode(LABEL_JENIS_PENCEMARAN, b.jenis),
      tingkatKeparahan: keparahan,
      warnaPeta: String(b.warna_peta ?? "").trim() || WARNA_KEPARAHAN[keparahan] || "",
      deskripsi: b.deskripsi,
      ikonUrl: "",
      aktif: ["ya", "y", "true", "1", "aktif", ""].includes(aktif) ? "on" : "",
    });
    if (!cek.success) {
      hasil.gagal.push({ baris: nomor, nama: b.nama ?? "", pesan: cek.error.issues[0].message });
      continue;
    }
    if (sudahAda.has(cek.data.nama.toLowerCase())) {
      hasil.dilewati.push({ baris: nomor, nama: cek.data.nama });
      continue;
    }
    try {
      await prisma.kategoriPencemaran.create({ data: cek.data });
      sudahAda.add(cek.data.nama.toLowerCase());
      hasil.dibuat++;
    } catch (e) {
      hasil.gagal.push({ baris: nomor, nama: cek.data.nama, pesan: e?.code === "P2002" ? "Nama kategori sudah ada" : "Gagal disimpan" });
    }
  }
  if (hasil.dibuat) refresh();
  return hasil;
}

export async function hapusKategori(id) {
  await requireAkses("/admin/kategori-pencemaran");
  try {
    await prisma.kategoriPencemaran.delete({ where: { id } });
  } catch (e) {
    if (e?.code === "P2003") return { pesan: "Kategori sudah dipakai laporan, nonaktifkan saja" };
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
