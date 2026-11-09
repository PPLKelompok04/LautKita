"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function bukaNotifikasi(id) {
  const user = await requireRole();
  const n = await prisma.notifikasi.findFirst({ where: { id, userId: user.id } });
  if (!n) return;
  await prisma.notifikasi.update({ where: { id }, data: { dibaca: true } });
  if (n.tautan) redirect(n.tautan);
  refresh();
}

export async function bacaSemua() {
  const user = await requireRole();
  await prisma.notifikasi.updateMany({ where: { userId: user.id, dibaca: false }, data: { dibaca: true } });
  refresh();
}
