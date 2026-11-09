"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { monitoringSchema } from "@/lib/validasi/monitoring";

// peserta yang disetujui, admin, atau petugas
async function bolehCatat(user, programId) {
  if (["ADMIN", "PETUGAS"].includes(user.role.kode)) return true;
  const peserta = await prisma.pesertaProgram.findFirst({ where: { programId, userId: user.id, status: "DISETUJUI" } });
  return Boolean(peserta);
}

export async function simpanMonitoring(id, _state, formData) {
  const user = await requireRole();
  const { data, pesan, nilai } = validasi(monitoringSchema, formData);
  if (pesan) return { pesan, nilai };
  if (!(await bolehCatat(user, data.programId))) return gagal("Kamu belum terdaftar sebagai peserta program ini", formData);

  try {
    // catatan yang direvisi dikirim ulang ke verifikator
    if (id) {
      await prisma.monitoringBudidaya.update({
        where: { id, pencatatId: user.id, status: { in: ["MENUNGGU", "REVISI"] } },
        data: { ...data, status: "MENUNGGU" },
      });
    } else {
      await prisma.monitoringBudidaya.create({ data: { ...data, pencatatId: user.id } });
    }
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/monitoring");
}

export async function hapusMonitoring(id) {
  const user = await requireRole();
  try {
    await prisma.monitoringBudidaya.delete({ where: { id, pencatatId: user.id, status: { in: ["MENUNGGU", "REVISI"] } } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  redirect("/monitoring");
}
