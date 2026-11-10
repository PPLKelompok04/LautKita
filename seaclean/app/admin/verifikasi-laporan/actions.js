"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { kirimNotifikasi } from "@/lib/notifikasi";
import { kode } from "@/components/admin/Halaman";
import { gagal, validasi } from "@/lib/validasi/umum";
import { verifikasiSchema } from "@/lib/validasi/verifikasiLaporan";

export async function verifikasiLaporan(laporanId, _state, formData) {
  const user = await requireRole("ADMIN", "PETUGAS");
  const { data, pesan, nilai } = validasi(verifikasiSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    await prisma.$transaction(async (tx) => {
      // gagal kalau laporan sudah diverifikasi orang lain duluan
      const laporan = await tx.laporanPencemaran.update({
        where: { id: laporanId, status: "MENUNGGU" },
        data: { status: data.keputusan },
      });
      await tx.verifikasiLaporan.create({ data: { ...data, laporanId, verifikatorId: user.id } });
      await kirimNotifikasi(
        {
          userId: laporan.pelaporId,
          judul: data.keputusan === "VALID" ? "Laporanmu dinyatakan valid" : "Laporanmu ditolak",
          isi: `${kode("LP", laporan.id)} ${laporan.judul}. Catatan: ${data.catatan}`,
          tautan: `/lapor/${laporan.id}`,
        },
        tx
      );
    });
  } catch (e) {
    if (e?.code === "P2025" || e?.code === "P2002") return gagal("Laporan ini sudah diverifikasi", formData);
    throw e;
  }
  redirect("/admin/verifikasi-laporan");
}
