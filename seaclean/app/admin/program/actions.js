"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAkses } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { programSchema } from "@/lib/validasi/program";
import { LABEL_EKOSISTEM } from "@/lib/validasi/lokasi";

export async function simpanProgram(id, _state, formData) {
  await requireAkses("/admin/program");
  const { data, pesan, nilai } = validasi(programSchema, formData);
  if (pesan) return { pesan, nilai };

  // jenis budidaya ikut spesies
  const [spesies, lokasi] = await Promise.all([
    prisma.spesies.findUnique({ where: { id: data.spesiesId }, select: { ekosistem: true } }),
    prisma.lokasiBudidaya.findUnique({ where: { id: data.lokasiId }, select: { ekosistem: true } }),
  ]);
  if (!spesies) return gagal("Spesies yang dipilih tidak ditemukan", formData);
  if (!lokasi) return gagal("Lokasi yang dipilih tidak ditemukan", formData);
  // mis. bibit mangrove tidak bisa ditanam di lokasi terumbu karang
  if (lokasi.ekosistem !== spesies.ekosistem) {
    return gagal(
      `Ekosistem lokasi (${LABEL_EKOSISTEM[lokasi.ekosistem]}) tidak cocok dengan spesies (${LABEL_EKOSISTEM[spesies.ekosistem]}). Pilih lokasi atau spesies yang sesuai.`,
      formData
    );
  }
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
  await requireAkses("/admin/program");
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
