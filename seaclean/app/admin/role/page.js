import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { Judul, Kartu, Lencana, Memuat, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { ROLE_SISTEM } from "@/lib/validasi/user";
import { hapusRole } from "./actions";
import { HALAMAN_AKSES } from "../menu";

export const metadata = { title: "Role - LautKita" };

export default function RolePage() {
  return (
    <>
      <Judul
        judul="Role"
        keterangan="Peran pengguna dan hak aksesnya"
        tambah={{ href: "/admin/role/baru", label: "Tambah Role" }}
      />
      <Suspense fallback={<Memuat />}>
        <DaftarRole />
      </Suspense>
    </>
  );
}

async function DaftarRole() {
  await connection();
  const data = await prisma.role.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { id: "asc" },
  });

  return (
    <Kartu judul="Daftar role">
    <Tabel kolom={["Kode", "Nama", "Deskripsi", "Hak akses panel", "Jumlah User", ""]}>
      {data.map((r) => (
        <tr key={r.id}>
          <td>
            <Lencana warna={ROLE_SISTEM.includes(r.kode) ? "biru" : "slate"}>{r.kode}</Lencana>
          </td>
          <td className="font-medium">{r.nama}</td>
          <td className="text-slate-600">{r.deskripsi}</td>
          <td className="max-w-xs text-slate-600">
            {r.kode === "ADMIN"
              ? "Semua halaman"
              : r.akses.length
                ? HALAMAN_AKSES.filter((h) => r.akses.includes(h.href)).map((h) => h.label).join(", ")
                : "Tidak ada (hanya halaman anggota)"}
          </td>
          <td>{r._count.users}</td>
          <td className="space-x-3 whitespace-nowrap">
            <Link href={`/admin/role/${r.id}`} className="font-semibold text-laut hover:underline">
              Edit
            </Link>
            {!ROLE_SISTEM.includes(r.kode) && (
              <TombolHapus aksi={hapusRole.bind(null, r.id)} konfirmasi={`Hapus role "${r.nama}"?`} />
            )}
          </td>
        </tr>
      ))}
    </Tabel>
    </Kartu>
  );
}
