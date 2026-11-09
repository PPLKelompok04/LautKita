import { prisma } from "@/lib/prisma";

// program yang boleh dicatat user ini, untuk pilihan di form
export async function opsiProgram(user) {
  const staf = ["ADMIN", "PETUGAS"].includes(user.role);
  const daftar = await prisma.programBudidaya.findMany({
    where: staf
      ? { status: { in: ["DIBUKA", "BERJALAN"] } }
      : { peserta: { some: { userId: user.id, status: "DISETUJUI" } } },
    orderBy: { nama: "asc" },
    select: { id: true, nama: true },
  });
  return Object.fromEntries(daftar.map((p) => [p.id, p.nama]));
}
