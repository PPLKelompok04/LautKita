import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Judul, Kartu, Memuat, Pencarian, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { hapusWilayah } from "./actions";

export const metadata = { title: "Wilayah - LautKita" };

export default function WilayahPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Wilayah"
        keterangan="Data bersama · dipakai user, lokasi budidaya, kegiatan, dan rawan abrasi"
        tambah={{ href: "/admin/wilayah/baru", label: "Tambah Wilayah" }}
      />
      <Suspense fallback={<Memuat />}>
        <DaftarWilayah searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function DaftarWilayah({ searchParams }) {
  const { q = "" } = await searchParams;
  const data = await prisma.wilayah.findMany({
    where: {
      OR: [
        { nama: { contains: q, mode: "insensitive" } },
        { kabupatenKota: { contains: q, mode: "insensitive" } },
        { provinsi: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ provinsi: "asc" }, { nama: "asc" }],
  });

  return (
    <Kartu judul="Daftar wilayah">
      <Pencarian action="/admin/wilayah" q={q} placeholder="Cari wilayah, kab/kota, provinsi..." />
      <Tabel kolom={["Wilayah", "Kabupaten/Kota", "Provinsi", ""]}>
        {data.map((w) => (
          <tr key={w.id}>
            <td className="font-medium">{w.nama}</td>
            <td className="text-slate-600">{w.kabupatenKota}</td>
            <td className="text-slate-600">{w.provinsi}</td>
            <td className="space-x-3 whitespace-nowrap">
              <Link href={`/admin/wilayah/${w.id}`} className="font-semibold text-laut hover:underline">
                Edit
              </Link>
              <TombolHapus aksi={hapusWilayah.bind(null, w.id)} konfirmasi={`Hapus wilayah "${w.nama}"?`} />
            </td>
          </tr>
        ))}
      </Tabel>
    </Kartu>
  );
}
