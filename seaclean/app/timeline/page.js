import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Memuat } from "@/components/admin/Halaman";
import TombolKeluar from "@/components/TombolKeluar";
import FormPostingan from "./FormPostingan";
import KartuPostingan from "./KartuPostingan";

export const metadata = { title: "Timeline - LautKita" };

export default function TimelinePage({ searchParams }) {
  return (
    <div className="flex-1 bg-latar">
      <header className="sticky top-0 z-10 border-b border-garis bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Link href="/timeline" className="leading-tight">
            <span className="block text-lg font-extrabold text-laut">LAUTKITA</span>
            <span className="block text-xs text-redup">Timeline</span>
          </Link>
          <TombolKeluar className="rounded-[10px] border border-garis px-3 py-1.5 text-xs font-semibold text-laut hover:bg-latar" />
        </div>
      </header>
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

  const [daftar, topikPopuler] = await Promise.all([
    prisma.postingan.findMany({
      where: {
        // penulis tetap bisa lihat postingannya
        OR: [{ status: "TAMPIL" }, { penulisId: userId }],
        ...(tag ? { tag: { some: { tag: { nama: tag.toLowerCase() } } } } : {}),
      },
      include: {
        penulis: { select: { nama: true, fotoUrl: true, role: { select: { nama: true } }, wilayah: { select: { nama: true, provinsi: true } } } },
        tag: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    // tag terpopuler
    prisma.tag.findMany({ orderBy: { postingan: { _count: "desc" } }, take: 6, select: { nama: true } }),
  ]);

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
      {daftar.length === 0 && <p className="text-center text-sm text-redup">Belum ada postingan.</p>}
      {daftar.map((p) => (
        <KartuPostingan
          key={p.id}
          postingan={{ ...p, tag: p.tag.map((t) => t.tag.nama) }}
          milikSendiri={p.penulisId === userId}
          bisaHapus={p.penulisId === userId || admin}
        />
      ))}
    </>
  );
}
