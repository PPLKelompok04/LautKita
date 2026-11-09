"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { pesanErrorPrisma } from "@/lib/validasi/umum";

// untuk laporan spam / dobel
export async function hapusLaporanAdmin(id) {
  await requireRole("ADMIN");
  try {
    await prisma.laporanPencemaran.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  redirect("/admin/laporan");
}
