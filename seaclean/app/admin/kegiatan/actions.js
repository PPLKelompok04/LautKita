"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { kegiatanSchema } from "@/lib/validasi/kegiatan";

export async function simpanKegiatan(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(kegiatanSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (id) await prisma.kegiatan.update({ where: { id }, data });
    else await prisma.kegiatan.create({ data });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/kegiatan");
}

export async function hapusKegiatan(id) {
  await requireRole("ADMIN");
  try {
    await prisma.kegiatan.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
