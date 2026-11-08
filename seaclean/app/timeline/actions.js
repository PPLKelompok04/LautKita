"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { ambilTag, postinganSchema } from "@/lib/validasi/postingan";

function hubungkanTag(isi) {
  return ambilTag(isi).map((nama) => ({
    tag: { connectOrCreate: { where: { nama }, create: { nama } } },
  }));
}

export async function buatPostingan(_state, formData) {
  const user = await requireRole();
  const { data, pesan, nilai } = validasi(postinganSchema, formData);
  if (pesan) return { pesan, nilai };

  await prisma.postingan.create({
    data: { ...data, penulisId: user.id, tag: { create: hubungkanTag(data.isi) } },
  });
  refresh();
  return { ok: true };
}

// cuma penulis yang bisa edit
export async function ubahPostingan(id, _state, formData) {
  const user = await requireRole();
  const { data, pesan, nilai } = validasi(postinganSchema, formData);
  if (pesan) return { pesan, nilai };

  try {
    await prisma.postingan.update({
      where: { id, penulisId: user.id },
      data: { ...data, tag: { deleteMany: {}, create: hubungkanTag(data.isi) } },
    });
  } catch (e) {
    return gagal(pesanErrorPrisma(e), formData);
  }
  refresh();
  return { ok: true };
}

// penulis atau admin bisa hapus
export async function hapusPostingan(id) {
  const user = await requireRole();
  try {
    await prisma.postingan.delete({
      where: user.role.kode === "ADMIN" ? { id } : { id, penulisId: user.id },
    });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
