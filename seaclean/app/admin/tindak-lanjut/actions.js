"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { kirimNotifikasi } from "@/lib/notifikasi";
import { kode } from "@/components/admin/Halaman";
import { gagal, validasi } from "@/lib/validasi/umum";
import { penangananSchema, penugasanSchema } from "@/lib/validasi/tindakLanjut";

export async function tugaskanPetugas(laporanId, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(penugasanSchema, formData);
  if (pesan) return { pesan, nilai };

  const petugas = await prisma.user.findFirst({ where: { id: data.petugasId, aktif: true, role: { kode: "PETUGAS" } } });
  if (!petugas) return gagal("Petugas tidak ditemukan atau tidak aktif", formData);

  try {
    await prisma.$transaction(async (tx) => {
      // hanya laporan yang sudah valid
      const laporan = await tx.laporanPencemaran.update({
        where: { id: laporanId, status: "VALID" },
        data: { status: "DITINDAKLANJUTI" },
      });
      await tx.tindakLanjut.create({ data: { ...data, laporanId } });
      const label = `${kode("LP", laporan.id)} ${laporan.judul}`;
      await kirimNotifikasi(
        { userId: petugas.id, judul: "Tugas tindak lanjut baru", isi: label, tautan: `/admin/tindak-lanjut/${laporan.id}` },
        tx
      );
      await kirimNotifikasi(
        { userId: laporan.pelaporId, judul: "Laporanmu sedang ditindaklanjuti", isi: label, tautan: `/lapor/${laporan.id}` },
        tx
      );
    });
  } catch (e) {
    if (e?.code === "P2025" || e?.code === "P2002") return gagal("Laporan ini sudah ditugaskan atau belum valid", formData);
    throw e;
  }
  redirect("/admin/tindak-lanjut");
}

export async function selesaikanTindakLanjut(laporanId, _state, formData) {
  const user = await requireRole("ADMIN", "PETUGAS");
  const { data, pesan, nilai } = validasi(penangananSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    await prisma.$transaction(async (tx) => {
      // petugas hanya bisa menyelesaikan tugasnya sendiri
      await tx.tindakLanjut.update({
        where: {
          laporanId,
          status: "DITUGASKAN",
          ...(user.role.kode === "ADMIN" ? {} : { petugasId: user.id }),
        },
        data: { ...data, status: "SELESAI", selesaiAt: new Date() },
      });
      const laporan = await tx.laporanPencemaran.update({ where: { id: laporanId }, data: { status: "SELESAI" } });
      await kirimNotifikasi(
        {
          userId: laporan.pelaporId,
          judul: "Laporanmu sudah selesai ditangani",
          isi: `${kode("LP", laporan.id)} ${laporan.judul}. ${data.catatanPenanganan}`,
          tautan: `/lapor/${laporan.id}`,
        },
        tx
      );
    });
  } catch (e) {
    if (e?.code === "P2025") return gagal("Tugas ini sudah selesai atau bukan milikmu", formData);
    throw e;
  }
  redirect("/admin/tindak-lanjut");
}
