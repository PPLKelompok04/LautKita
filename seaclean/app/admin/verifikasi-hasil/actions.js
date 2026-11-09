"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { kirimNotifikasi } from "@/lib/notifikasi";
import { gagal, validasi } from "@/lib/validasi/umum";
import { LABEL_KEPUTUSAN_HASIL, verifikasiHasilSchema } from "@/lib/validasi/verifikasiHasil";

export async function verifikasiHasil(monitoringId, _state, formData) {
  const user = await requireRole("ADMIN", "PETUGAS");
  const { data, pesan, nilai } = validasi(verifikasiHasilSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    await prisma.$transaction(async (tx) => {
      const m = await tx.monitoringBudidaya.update({
        where: { id: monitoringId, status: "MENUNGGU" },
        data: { status: data.keputusan },
        include: { program: { select: { nama: true } } },
      });
      await tx.verifikasiHasil.create({ data: { ...data, monitoringId, verifikatorId: user.id } });
      await kirimNotifikasi(
        {
          userId: m.pencatatId,
          judul: `Hasil monitoring: ${LABEL_KEPUTUSAN_HASIL[data.keputusan].toLowerCase()}`,
          isi: `${m.program.nama}. Catatan: ${data.catatan}`,
          tautan: data.keputusan === "REVISI" ? `/monitoring/${m.id}` : "/monitoring",
        },
        tx
      );
    });
  } catch (e) {
    if (e?.code === "P2025") return gagal("Catatan ini sudah diverifikasi", formData);
    throw e;
  }
  redirect("/admin/verifikasi-hasil");
}
