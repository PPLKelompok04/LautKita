"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { bibitSchema, spesiesSchema } from "@/lib/validasi/spesies";

export async function simpanSpesies(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(spesiesSchema, formData);
  if (pesan) return { pesan, nilai };

  let spesies;
  try {
    spesies = id
      ? await prisma.spesies.update({ where: { id }, data })
      : await prisma.spesies.create({ data });
  } catch (e) {
    if (e?.code === "P2002") return gagal("Nama ilmiah sudah dipakai spesies lain", formData);
    return gagal(pesanErrorPrisma(e), formData);
  }
  // balik ke spesies yang barusan disimpan
  redirect(`/admin/spesies?pilih=${spesies.id}`);
}

export async function hapusSpesies(id) {
  await requireRole("ADMIN");
  try {
    await prisma.spesies.delete({ where: { id } });
  } catch (e) {
    if (e?.code === "P2003") return { pesan: "Spesies masih dipakai program budidaya. Ubah status katalog jadi Nonaktif saja." };
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}

export async function simpanBibit(spesiesId, bibitId, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(bibitSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    if (bibitId) await prisma.bibit.update({ where: { id: bibitId, spesiesId }, data });
    else await prisma.bibit.create({ data: { ...data, spesiesId } });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  refresh();
  return { ok: true };
}

export async function hapusBibit(spesiesId, bibitId) {
  await requireRole("ADMIN");
  try {
    await prisma.bibit.delete({ where: { id: bibitId, spesiesId } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
