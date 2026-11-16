"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAkses } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { rawanAbrasiSchema } from "@/lib/validasi/rawanAbrasi";

export async function simpanRawanAbrasi(id, _state, formData) {
  await requireAkses("/admin/rawan-abrasi");
  const { data, pesan, nilai } = validasi(rawanAbrasiSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (id) await prisma.lokasiRawanAbrasi.update({ where: { id }, data });
    else await prisma.lokasiRawanAbrasi.create({ data });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/rawan-abrasi");
}

export async function hapusRawanAbrasi(id) {
  await requireAkses("/admin/rawan-abrasi");
  try {
    await prisma.lokasiRawanAbrasi.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
