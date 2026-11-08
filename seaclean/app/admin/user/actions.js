"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { gagal, pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { userSchema } from "@/lib/validasi/user";

export async function simpanUser(id, _state, formData) {
  const admin = await requireRole("ADMIN");
  const { data, pesan, nilai } = validasi(userSchema, formData);
  if (pesan) return { pesan, nilai };

  const { password, ...isi } = data;
  if (!id && !password) return gagal("Password wajib diisi untuk user baru", formData);

  if (id === admin.id) {
    // biar admin tidak menonaktifkan akunnya sendiri
    if (!isi.aktif) return gagal("Tidak bisa menonaktifkan akun sendiri", formData);
    if (isi.roleId !== admin.roleId) return gagal("Tidak bisa mengganti role akun sendiri", formData);
  }
  if (password) isi.passwordHash = await bcrypt.hash(password, 10);

  try {
    if (id) await prisma.user.update({ where: { id }, data: isi });
    else await prisma.user.create({ data: isi });
  } catch (e) {
    if (e?.code === "P2002") return gagal("Email sudah dipakai user lain", formData);
    return gagal(pesanErrorPrisma(e), formData);
  }
  redirect("/admin/user");
}

export async function hapusUser(id) {
  const admin = await requireRole("ADMIN");
  if (id === admin.id) return { pesan: "Tidak bisa menghapus akun sendiri" };
  try {
    await prisma.user.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
