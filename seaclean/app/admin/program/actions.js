"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { programSchema } from "@/lib/validasi/program";

export async function simpanProgram(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(programSchema, formData);
  if (pesan) return { pesan, nilai };

  // jenis budidaya ikut spesies
  const spesies = await prisma.spesies.findUnique({ where: { id: data.spesiesId }, select: { ekosistem: true } });
  if (!spesies) return gagal("Spesies yang dipilih tidak ditemukan", formData);
  const isi = { ...data, ekosistem: spesies.ekosistem };

  let program;
  try {
    program = id
      ? await prisma.programBudidaya.update({ where: { id }, data: isi })
      : await prisma.programBudidaya.create({ data: isi });
  } catch (e) {
    if (e?.code === "P2003") return gagal("Lokasi yang dipilih tidak ditemukan", formData);
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect(`/admin/program?pilih=${program.id}`);
}

// cuma draf yang bisa dihapus
export async function hapusProgram(id) {
  await requireRole("ADMIN");
  const program = await prisma.programBudidaya.findUnique({ where: { id }, select: { status: true } });
  if (program && program.status !== "DRAF") {
    return { pesan: "Hanya program berstatus Draf yang bisa dihapus. Program lain cukup diubah statusnya jadi Selesai." };
  }
  try {
    await prisma.programBudidaya.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  redirect("/admin/program");
}
