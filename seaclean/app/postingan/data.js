// include yang dipakai timeline dan halaman detail postingan
export function includePostingan(userId) {
  return {
    penulis: { select: { nama: true, fotoUrl: true, role: { select: { nama: true } }, wilayah: { select: { nama: true, provinsi: true } } } },
    tag: { include: { tag: true } },
    _count: { select: { suka: true, komentar: true, bagikan: true } },
    suka: { where: { userId }, select: { userId: true } },
    bagikan: { where: { userId }, select: { id: true } },
  };
}

// bentuk data untuk <KartuPostingan>
export function untukKartu(p) {
  return {
    ...p,
    tag: p.tag.map((t) => t.tag.nama),
    interaksi: { suka: p._count.suka, komentar: p._count.komentar, bagikan: p._count.bagikan, sudahSuka: p.suka.length > 0, sudahBagikan: p.bagikan.length > 0 },
  };
}
