"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAkses } from "@/lib/auth";
import { pesanErrorPrisma } from "@/lib/validasi/umum";
import { LABEL_KEHADIRAN } from "@/lib/validasi/pendaftaranKegiatan";

export async function ubahKehadiran(id, kehadiran) {
  await requireAkses("/admin/peserta-kegiatan");
  if (!LABEL_KEHADIRAN[kehadiran]) return { pesan: "Status kehadiran tidak valid" };
  try {
    await prisma.pendaftaranKegiatan.update({ where: { id }, data: { kehadiran } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

export async function hapusPeserta(id) {
  await requireAkses("/admin/peserta-kegiatan");
  try {
    await prisma.$transaction(async (tx) => {
      const p = await tx.pendaftaranKegiatan.delete({ where: { id }, include: { kegiatan: true } });
      if (p.kegiatan.status === "PENUH") await tx.kegiatan.update({ where: { id: p.kegiatanId }, data: { status: "DIBUKA" } });
    });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
