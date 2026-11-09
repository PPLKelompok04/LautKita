"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { laporanSchema } from "@/lib/validasi/laporan";

// id null = laporan baru
export async function simpanLaporan(id, _state, formData) {
  const user = await requireRole();
  const { data, pesan, nilai } = validasi(laporanSchema, formData);
  if (pesan) return { pesan, nilai };

  const kategori = await prisma.kategoriPencemaran.findFirst({ where: { id: data.kategoriId, aktif: true } });
  if (!kategori) return gagal("Kategori tidak ditemukan", formData);

  try {
    // laporan yang sudah diverifikasi tidak bisa diubah lagi
    if (id) await prisma.laporanPencemaran.update({ where: { id, pelaporId: user.id, status: "MENUNGGU" }, data });
    else await prisma.laporanPencemaran.create({ data: { ...data, pelaporId: user.id } });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/lapor");
}

export async function hapusLaporan(id) {
  const user = await requireRole();
  try {
    await prisma.laporanPencemaran.delete({ where: { id, pelaporId: user.id, status: "MENUNGGU" } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  redirect("/lapor");
}
