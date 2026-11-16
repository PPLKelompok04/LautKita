import { daftarWilayah, opsiWilayah } from "@/lib/wilayah";

// include yang dipakai timeline dan halaman detail postingan
export function includePostingan(userId) {
  return {
    penulis: { select: { nama: true, fotoUrl: true, role: { select: { nama: true } }, wilayah: { select: { nama: true, provinsi: true } } } },
    // tag lokasi postingan (PBI-06)
    wilayah: { select: { nama: true, provinsi: true } },
    tag: { include: { tag: true } },
    _count: { select: { suka: true, komentar: true, bagikan: true } },
    suka: { where: { userId }, select: { userId: true } },
    bagikan: { where: { userId }, select: { id: true } },
    // pesan peringatan admin hanya ikut terkirim kalau yang melihat adalah penulisnya
    peringatan: { where: { postingan: { penulisId: userId } }, orderBy: { createdAt: "desc" }, take: 1, select: { pesan: true } },
  };
}

// bentuk data untuk <KartuPostingan>
export function untukKartu(p) {
  return {
    ...p,
    tag: p.tag.map((t) => t.tag.nama),
    // lokasi postingan; postingan lama tanpa tag lokasi memakai wilayah profil penulis
    lokasi: p.wilayah ?? p.penulis.wilayah,
    peringatan: p.peringatan?.[0]?.pesan ?? null,
    interaksi: { suka: p._count.suka, komentar: p._count.komentar, bagikan: p._count.bagikan, sudahSuka: p.suka.length > 0, sudahBagikan: p.bagikan.length > 0 },
  };
}

// opsi lokasi untuk form postingan
export async function opsiLokasiPostingan() {
  return opsiWilayah(await daftarWilayah());
}
