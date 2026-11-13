import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Kartu, Memuat } from "@/components/admin/Halaman";
import { HalamanAnggota } from "@/components/anggota/Halaman";
import KartuPostingan from "@/app/timeline/KartuPostingan";
import { includePostingan, untukKartu } from "../data";
import { FormKomentar, ItemKomentar } from "./Komentar";

export const metadata = { title: "Postingan - LautKita" };

const PENGGUNA = { select: { nama: true } };

export default function DetailPostinganPage({ params }) {
  return (
    <HalamanAnggota>
      <Link href="/timeline" className="text-xs font-semibold text-laut hover:underline">
        ← Kembali ke timeline
      </Link>
      <Suspense fallback={<Memuat />}>
        <Isi params={params} />
      </Suspense>
    </HalamanAnggota>
  );
}

async function Isi({ params }) {
  const id = Number((await params).id);
  const session = await getSession();
  const userId = session.user.id;
  const admin = session.user.role === "ADMIN";

  const p = Number.isInteger(id)
    ? await prisma.postingan.findUnique({
        where: { id },
        include: {
          ...includePostingan(userId),
          komentar: {
            where: { parentId: null },
            include: { user: PENGGUNA, balasan: { include: { user: PENGGUNA }, orderBy: { createdAt: "asc" } } },
            orderBy: { createdAt: "asc" },
          },
        },
      })
    : null;
  // postingan yang disembunyikan cuma bisa dilihat penulis dan admin
  if (!p || (p.status !== "TAMPIL" && p.penulisId !== userId && !admin)) notFound();
  const milikSendiri = p.penulisId === userId;

  return (
    <>
      <KartuPostingan postingan={untukKartu(p)} milikSendiri={milikSendiri} bisaHapus={milikSendiri || admin} />
      <Kartu judul={`Komentar · ${p._count.komentar}`}>
        {p.status === "TAMPIL" && <FormKomentar postinganId={p.id} />}
        <div className="flex flex-col divide-y divide-garis">
          {p.komentar.length === 0 && <p className="py-3 text-sm text-redup">Belum ada komentar.</p>}
          {p.komentar.map((k) => (
            <ItemKomentar key={k.id} komentar={k} postinganId={p.id} userId={userId} bisaHapusSemua={milikSendiri || admin} />
          ))}
        </div>
      </Kartu>
    </>
  );
}
