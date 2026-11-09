"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { kategoriPencemaranSchema } from "@/lib/validasi/kategoriPencemaran";

export async function simpanKategori(id, _state, formData) {
  await requireRole("ADMIN");
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

export async function hapusKategori(id) {
  await requireRole("ADMIN");
  try {
    await prisma.kategoriPencemaran.delete({ where: { id } });
  } catch (e) {
    if (e?.code === "P2003") return { pesan: "Kategori sudah dipakai laporan, nonaktifkan saja" };
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
