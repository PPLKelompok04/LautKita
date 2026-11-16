"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { ROLE_SISTEM, roleSchema } from "@/lib/validasi/user";
import { HALAMAN_AKSES } from "../menu";

export async function simpanRole(id, _state, formData) {
  await requireRole("ADMIN");
  // checkbox hak akses bisa lebih dari satu, jadi dibaca dengan getAll (validasi() hanya mengambil satu nilai)
  const akses = formData.getAll("akses").filter((h) => HALAMAN_AKSES.some((x) => x.href === h));
  const { data: isi, pesan, nilai } = validasi(roleSchema, formData);
  if (pesan) return { pesan, nilai: { ...nilai, akses } };
  const data = { ...isi, akses: isi.kode === "ADMIN" ? [] : akses };
  // kembalikan isian form termasuk semua centang hak akses
  const gagalRole = (pesan) => {
    const hasil = gagal(pesan, formData);
    return { ...hasil, nilai: { ...hasil.nilai, akses } };
  };

  if (id) {
    const lama = await prisma.role.findUnique({ where: { id } });
    if (lama && ROLE_SISTEM.includes(lama.kode) && lama.kode !== data.kode) {
      return gagalRole("Kode role bawaan sistem tidak boleh diganti");
    }
  }

  try {
    if (id) await prisma.role.update({ where: { id }, data });
    else await prisma.role.create({ data });
  } catch (e) {
    if (e?.code === "P2002") return gagalRole("Kode role sudah dipakai");
    return gagalRole(pesanErrorPrisma(e));
  }
  redirect("/admin/role");
}

export async function hapusRole(id) {
  await requireRole("ADMIN");
  const role = await prisma.role.findUnique({ where: { id } });
  if (role && ROLE_SISTEM.includes(role.kode)) return { pesan: "Role bawaan sistem tidak boleh dihapus" };
  try {
    await prisma.role.delete({ where: { id } });
  } catch (e) {
    if (e?.code === "P2003") return { pesan: "Role masih dipakai user, pindahkan dulu user-nya" };
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
