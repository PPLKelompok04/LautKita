"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { lokasiSchema, zonaSchema } from "@/lib/validasi/lokasi";

// id = null untuk tambah, angka untuk edit
export async function simpanLokasi(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(lokasiSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (id) await prisma.lokasiBudidaya.update({ where: { id }, data });
    else await prisma.lokasiBudidaya.create({ data });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/lokasi");
}

export async function hapusLokasi(id) {
  await requireRole("ADMIN");
  try {
    await prisma.lokasiBudidaya.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

// zonaId = null untuk tambah zona baru di lokasi `lokasiId`
export async function simpanZona(lokasiId, zonaId, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(zonaSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (zonaId) await prisma.zona.update({ where: { id: zonaId, lokasiId }, data });
    else await prisma.zona.create({ data: { ...data, lokasiId } });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  refresh();
  return { ok: true };
}

export async function hapusZona(lokasiId, zonaId) {
  await requireRole("ADMIN");
  try {
    await prisma.zona.delete({ where: { id: zonaId, lokasiId } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
