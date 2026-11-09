"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { kirimNotifikasi } from "@/lib/notifikasi";

export async function putuskanPeserta(id, setuju, catatan) {
  await requireRole("ADMIN");
  catatan = String(catatan ?? "").trim() || null;
  if (!setuju && !catatan) return { pesan: "Isi alasan penolakan dulu" };

  try {
    await prisma.$transaction(async (tx) => {
      const peserta = await tx.pesertaProgram.findUnique({ where: { id }, include: { program: true } });
      if (!peserta || peserta.status !== "MENUNGGU") throw new Error("Pendaftaran ini sudah diproses");

      if (setuju) {
        const terisi = await tx.pesertaProgram.count({ where: { programId: peserta.programId, status: "DISETUJUI" } });
        if (terisi >= peserta.program.kuotaPeserta) throw new Error("Kuota peserta program sudah penuh");
      }
      await tx.pesertaProgram.update({ where: { id }, data: { status: setuju ? "DISETUJUI" : "DITOLAK", catatan } });
      await kirimNotifikasi(
        {
          userId: peserta.userId,
          judul: setuju ? "Kamu diterima di program budidaya" : "Pendaftaran program ditolak",
          isi: setuju ? `${peserta.program.nama}. Sekarang kamu bisa mencatat monitoring.` : `${peserta.program.nama}. Alasan: ${catatan}`,
          tautan: "/program",
        },
        tx
      );
    });
  } catch (e) {
    return { pesan: e.message };
  }
  refresh();
}
