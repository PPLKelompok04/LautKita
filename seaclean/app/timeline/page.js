import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Memuat } from "@/components/admin/Halaman";
import NavAnggota from "@/components/anggota/NavAnggota";
import { includePostingan, untukKartu } from "@/app/postingan/data";
import FormPostingan from "./FormPostingan";
import KartuPostingan from "./KartuPostingan";

export const metadata = { title: "Timeline - LautKita" };

export default function TimelinePage({ searchParams }) {
  return (
    <div className="flex-1 bg-latar">
      <NavAnggota />
      <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
        <Suspense fallback={<Memuat />}>
          <Feed searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function Feed({ searchParams }) {
  const [{ tag = "" }, session] = await Promise.all([searchParams, getSession()]);
  // -1 kalau belum login
  const userId = session?.user?.id ?? -1;
  const admin = session?.user?.role === "ADMIN";

  const filterTag = tag ? { tag: { some: { tag: { nama: tag.toLowerCase() } } } } : {};

  const [daftar, dibagikan, topikPopuler] = await Promise.all([
    prisma.postingan.findMany({
      where: {
        // penulis tetap bisa lihat postingannya
        OR: [{ status: "TAMPIL" }, { penulisId: userId }],
        ...filterTag,
      },
      include: includePostingan(userId),
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.bagikan.findMany({
      where: { postingan: { status: "TAMPIL", ...filterTag } },
      include: { user: { select: { nama: true } }, postingan: { include: includePostingan(userId) } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    // tag terpopuler
    prisma.tag.findMany({ orderBy: { postingan: { _count: "desc" } }, take: 6, select: { nama: true } }),
  ]);

  // postingan asli + yang dibagikan ulang, urut dari yang terbaru
  const feed = [
    ...daftar.map((p) => ({ kunci: `p${p.id}`, waktu: p.createdAt, postingan: p })),
    ...dibagikan.map((b) => ({
      kunci: `b${b.id}`,
      waktu: b.createdAt,
      postingan: b.postingan,
      dibagikan: { nama: b.user.nama, keterangan: b.keterangan },
    })),
  ].sort((a, b) => b.waktu - a.waktu);

  const chip = (aktif) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold ${aktif ? "bg-laut text-white" : "bg-white text-teks border border-garis"}`;

  return (
    <>
      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4">
        <Link href="/timeline" className={chip(!tag)}>
          Semua
        </Link>
        {topikPopuler.map((t) => (
          <Link key={t.nama} href={`/timeline?tag=${encodeURIComponent(t.nama)}`} className={chip(tag === t.nama)}>
            #{t.nama}
          </Link>
        ))}
      </nav>
      <FormPostingan />
      {feed.length === 0 && <p className="text-center text-sm text-redup">Belum ada postingan.</p>}
      {feed.map(({ kunci, postingan: p, dibagikan }) => (
        <KartuPostingan
          key={kunci}
          postingan={untukKartu(p)}
          dibagikan={dibagikan}
          // kartu repost tidak menampilkan Edit/Hapus, supaya postingan asli tidak terhapus dari repost
          milikSendiri={!dibagikan && p.penulisId === userId}
          bisaHapus={!dibagikan && (p.penulisId === userId || admin)}
        />
      ))}
    </>
  );
}
