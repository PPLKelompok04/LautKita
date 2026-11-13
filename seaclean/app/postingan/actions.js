"use server";

import { refresh } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { kirimNotifikasi } from "@/lib/notifikasi";
import { pesanErrorPrisma, validasi } from "@/lib/validasi/umum";
import { komentarSchema } from "@/lib/validasi/komentar";

async function postinganTampil(id) {
  const p = await prisma.postingan.findUnique({ where: { id }, select: { id: true, penulisId: true, status: true } });
  return p?.status === "TAMPIL" ? p : null;
}

// tidak kirim notifikasi ke diri sendiri
function kabari(penerimaId, pelaku, judul, isi, postinganId) {
  if (penerimaId === pelaku.id) return;
  return kirimNotifikasi({ userId: penerimaId, judul, isi, tautan: `/postingan/${postinganId}` });
}

// untuk suka & bagikan: kalau notifikasi yang sama sudah pernah dikirim, jangan kirim lagi
// (supaya like-unlike-like berulang tidak membanjiri notifikasi penulis)
async function kabariSekali(penerimaId, pelaku, judul, isi, postinganId) {
  if (penerimaId === pelaku.id) return;
  const sudah = await prisma.notifikasi.findFirst({
    where: { userId: penerimaId, judul, isi, tautan: `/postingan/${postinganId}` },
    select: { id: true },
  });
  if (!sudah) await kabari(penerimaId, pelaku, judul, isi, postinganId);
}

export async function toggleSuka(postinganId) {
  const user = await requireRole();
  const kunci = { postinganId_userId: { postinganId, userId: user.id } };

  if (await prisma.suka.findUnique({ where: kunci })) {
    await prisma.suka.delete({ where: kunci });
  } else {
    const p = await postinganTampil(postinganId);
    if (!p) return { pesan: "Postingan tidak ditemukan" };
    try {
      await prisma.suka.create({ data: { postinganId, userId: user.id } });
    } catch (e) {
      // klik dobel
      if (e?.code !== "P2002") throw e;
    }
    await kabariSekali(p.penulisId, user, "Postinganmu disukai", `${user.nama} menyukai postinganmu`, p.id);
  }
  refresh();
}

// toggle: kalau sudah dibagikan, panggilan ini membatalkan repost
export async function bagikanPostingan(postinganId, keterangan) {
  const user = await requireRole();
  const kunci = { postinganId_userId: { postinganId, userId: user.id } };

  if (await prisma.bagikan.findUnique({ where: kunci })) {
    await prisma.bagikan.delete({ where: kunci });
    refresh();
    return { ok: true };
  }

  const p = await postinganTampil(postinganId);
  if (!p) return { pesan: "Postingan tidak ditemukan" };
  try {
    await prisma.bagikan.create({ data: { postinganId, userId: user.id, keterangan: String(keterangan ?? "").trim().slice(0, 280) || null } });
  } catch (e) {
    // klik dobel
    if (e?.code !== "P2002") throw e;
  }
  await kabariSekali(p.penulisId, user, "Postinganmu dibagikan", `${user.nama} membagikan postinganmu`, p.id);
  refresh();
  return { ok: true };
}

// parentId diisi kalau membalas komentar
export async function tambahKomentar(postinganId, parentId, _state, formData) {
  const user = await requireRole();
  const { data, pesan } = validasi(komentarSchema, formData);
  if (pesan) return { pesan };

  const p = await postinganTampil(postinganId);
  if (!p) return { pesan: "Postingan tidak ditemukan" };

  let induk = null;
  if (parentId) {
    induk = await prisma.komentar.findFirst({ where: { id: parentId, postinganId } });
    if (!induk) return { pesan: "Komentar yang dibalas sudah dihapus" };
  }

  // balasan cuma satu tingkat
  await prisma.komentar.create({
    data: { postinganId, userId: user.id, isi: data.isi, parentId: induk ? (induk.parentId ?? induk.id) : null },
  });
  await kabari(p.penulisId, user, "Komentar baru", `${user.nama}: ${data.isi.slice(0, 80)}`, p.id);
  if (induk && induk.userId !== p.penulisId) {
    await kabari(induk.userId, user, "Komentarmu dibalas", `${user.nama}: ${data.isi.slice(0, 80)}`, p.id);
  }
  refresh();
  return { ok: true };
}

// pemilik komentar, penulis postingan, atau admin
export async function hapusKomentar(id) {
  const user = await requireRole();
  const k = await prisma.komentar.findUnique({ where: { id }, include: { postingan: { select: { penulisId: true } } } });
  if (!k) return { pesan: "Komentar tidak ditemukan" };
  if (![k.userId, k.postingan.penulisId].includes(user.id) && user.role.kode !== "ADMIN") {
    return { pesan: "Kamu tidak bisa menghapus komentar ini" };
  }
  try {
    await prisma.komentar.delete({ where: { id } });
  } catch (e) {
    return { pesan: pesanErrorPrisma(e) };
  }
  refresh();
}
