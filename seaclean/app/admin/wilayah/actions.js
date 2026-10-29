"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { wilayahSchema } from "@/lib/validasi/wilayah";

export async function simpanWilayah(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(wilayahSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (id) await prisma.wilayah.update({ where: { id }, data });
    else await prisma.wilayah.create({ data });
  } catch (e) {
    if (e?.code === "P2002") return gagal("Wilayah dengan nama dan provinsi yang sama sudah ada", formData);
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/wilayah");
}

// Data yang memakai wilayah ini tidak ikut terhapus, kolom wilayahnya jadi kosong
export async function hapusWilayah(id) {
  await requireRole("ADMIN");
  try {
    await prisma.wilayah.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
