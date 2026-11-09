"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { pesanErrorPrisma } from "@/lib/validasi/umum";
import { LABEL_STATUS_POSTINGAN } from "@/lib/validasi/postingan";

// sembunyikan / tampilkan postingan
export async function ubahStatusPostingan(id, status) {
  await requireRole("ADMIN");
  if (!LABEL_STATUS_POSTINGAN[status]) return { pesan: "Status tidak valid" };
  try {
    await prisma.postingan.update({ where: { id }, data: { status } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

// kirim pesan peringatan ke penulis (opsional sekalian menyembunyikan postingan)
export async function kirimPeringatan(postinganId, pesan, sembunyikan = false) {
  const sesi = await requireRole("ADMIN");

  const teks = String(pesan || "").trim();
  if (teks.length < 5) return { pesan: "Pesan peringatan minimal 5 karakter" };
  if (teks.length > 500) return { pesan: "Pesan peringatan maksimal 500 karakter" };

  try {
    // ambil id admin dari sesi; kalau bentuk sesinya beda, pakai admin pertama
    let adminId = Number(sesi?.id ?? sesi?.user?.id);
    if (!Number.isInteger(adminId)) {
      const admin = await prisma.user.findFirst({ where: { role: { kode: "ADMIN" } }, select: { id: true } });
      adminId = admin?.id;
    }
    if (!adminId) return { pesan: "Admin tidak ditemukan" };

    const operasi = [
      prisma.peringatanPostingan.create({ data: { postinganId, adminId, pesan: teks } }),
    ];
    if (sembunyikan) {
      operasi.push(prisma.postingan.update({ where: { id: postinganId }, data: { status: "DISEMBUNYIKAN" } }));
    }
    await prisma.$transaction(operasi);
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

// edit pesan peringatan
export async function ubahPeringatan(idPeringatan, pesan) {
  await requireRole("ADMIN");

  const teks = String(pesan || "").trim();
  if (teks.length < 5) return { pesan: "Pesan peringatan minimal 5 karakter" };
  if (teks.length > 500) return { pesan: "Pesan peringatan maksimal 500 karakter" };

  try {
    await prisma.peringatanPostingan.update({ where: { id: idPeringatan }, data: { pesan: teks } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

// hapus pesan peringatan
export async function hapusPeringatan(idPeringatan) {
  await requireRole("ADMIN");
  try {
    await prisma.peringatanPostingan.delete({ where: { id: idPeringatan } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}