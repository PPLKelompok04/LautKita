"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function daftarKegiatan(kegiatanId) {
  const user = await requireRole();
  try {
    await prisma.$transaction(async (tx) => {
      const kegiatan = await tx.kegiatan.findUnique({ where: { id: kegiatanId } });
      if (!kegiatan || kegiatan.status !== "DIBUKA" || kegiatan.tanggal < new Date()) throw new Error("Pendaftaran kegiatan ini sudah ditutup");

      const terisi = await tx.pendaftaranKegiatan.count({ where: { kegiatanId } });
      if (terisi >= kegiatan.kuota) throw new Error("Kuota kegiatan sudah penuh");

      await tx.pendaftaranKegiatan.create({ data: { kegiatanId, userId: user.id } });
      if (terisi + 1 >= kegiatan.kuota) await tx.kegiatan.update({ where: { id: kegiatanId }, data: { status: "PENUH" } });
    });
  } catch (e) {
    if (e?.code === "P2002") return { pesan: "Kamu sudah terdaftar di kegiatan ini" };
    return { pesan: e.message };
  }
  refresh();
}

export async function batalDaftar(kegiatanId) {
  const user = await requireRole();
  try {
    await prisma.$transaction(async (tx) => {
      const kegiatan = await tx.kegiatan.findUnique({ where: { id: kegiatanId } });
      if (!kegiatan || kegiatan.tanggal < new Date()) throw new Error("Kegiatan sudah lewat, tidak bisa dibatalkan");

      await tx.pendaftaranKegiatan.delete({ where: { kegiatanId_userId: { kegiatanId, userId: user.id } } });
      // kuota kebuka lagi
      if (kegiatan.status === "PENUH") await tx.kegiatan.update({ where: { id: kegiatanId }, data: { status: "DIBUKA" } });
    });
  } catch (e) {
    if (e?.code === "P2025") return { pesan: "Kamu belum terdaftar di kegiatan ini" };
    return { pesan: e.message };
  }
  refresh();
}
