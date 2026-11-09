"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function gabungProgram(programId, _state, formData) {
  const user = await requireRole();
  const motivasi = String(formData.get("motivasi") ?? "").trim() || null;

  const program = await prisma.programBudidaya.findUnique({ where: { id: programId } });
  if (!program || program.status !== "DIBUKA") return { pesan: "Pendaftaran program ini tidak dibuka" };
  // batas pendaftaran dihitung sampai akhir hari
  if (new Date(program.batasPendaftaran.getTime() + 86400000) < new Date()) return { pesan: "Batas pendaftaran sudah lewat" };

  try {
    await prisma.pesertaProgram.create({ data: { programId, userId: user.id, motivasi } });
  } catch (e) {
    if (e?.code === "P2002") return { pesan: "Kamu sudah mendaftar di program ini" };
    throw e;
  }
  refresh();
  return { ok: true };
}

// cuma bisa batal selama belum disetujui
export async function batalGabung(programId) {
  const user = await requireRole();
  const hasil = await prisma.pesertaProgram.deleteMany({ where: { programId, userId: user.id, status: "MENUNGGU" } });
  if (!hasil.count) return { pesan: "Pendaftaran sudah diproses admin, tidak bisa dibatalkan" };
  refresh();
}
