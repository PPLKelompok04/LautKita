import { prisma } from "@/lib/prisma";

// `db` bisa diisi tx kalau dipanggil di dalam prisma.$transaction
export function kirimNotifikasi({ userId, judul, isi, tautan = null }, db = prisma) {
  return db.notifikasi.create({ data: { userId, judul, isi, tautan } });
}

export function jumlahBelumDibaca(userId) {
  return prisma.notifikasi.count({ where: { userId, dibaca: false } });
}
