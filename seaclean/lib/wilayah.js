import { prisma } from "@/lib/prisma";

// Daftar wilayah untuk pilihan <select> di form (user, lokasi, kegiatan, rawan abrasi)
export function daftarWilayah() {
  return prisma.wilayah.findMany({
    select: { id: true, nama: true, provinsi: true },
    orderBy: [{ provinsi: "asc" }, { nama: "asc" }],
  });
}

// Ubah daftar wilayah jadi opsi untuk komponen <Select>
export function opsiWilayah(daftar) {
  return Object.fromEntries(daftar.map((w) => [w.id, `${w.nama}, ${w.provinsi}`]));
}
