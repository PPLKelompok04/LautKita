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
