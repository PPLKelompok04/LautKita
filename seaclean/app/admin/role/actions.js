"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { ROLE_SISTEM, roleSchema } from "@/lib/validasi/user";

export async function simpanRole(id, _state, formData) {
  await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(roleSchema, formData);
  if (pesan) return { pesan, nilai };

  if (id) {
    const lama = await prisma.role.findUnique({ where: { id } });
    if (lama && ROLE_SISTEM.includes(lama.kode) && lama.kode !== data.kode) {
      return gagal("Kode role bawaan sistem tidak boleh diganti", formData);
    }
  }

  try {
    if (id) await prisma.role.update({ where: { id }, data });
    else await prisma.role.create({ data });
  } catch (e) {
    if (e?.code === "P2002") return gagal("Kode role sudah dipakai", formData);
    return gagal(pesanErrorPrisma(e), formData);
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
