import Link from "next/link";
import { Suspense } from "react";
import { HardHat, UserCheck, UserX, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { Select } from "@/components/admin/Field";
import { TombolHapus } from "@/components/admin/Tombol";
import { hapusUser } from "./actions";

export const metadata = { title: "Manajemen Pengguna - LautKita" };

export default function UserPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Manajemen pengguna"
        keterangan="PBI-01 · Kelola akun, peran, dan akses seluruh pengguna platform."
        tambah={{ href: "/admin/user/baru", label: "Tambah pengguna" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", role = "" } = await searchParams;
  const [roles, data, total, relawanAktif, petugas, nonaktif] = await Promise.all([
    prisma.role.findMany({ orderBy: { id: "asc" } }),
    prisma.user.findMany({
      where: {
        OR: [
          { nama: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
        ...(role ? { role: { kode: role } } : {}),
      },
      include: { role: true, wilayah: { select: { nama: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { aktif: true, role: { kode: "RELAWAN" } } }),
    prisma.user.count({ where: { role: { kode: "PETUGAS" } } }),
    prisma.user.count({ where: { aktif: false } }),
  ]);

  return (
    <>
      <Statistik
        data={[
          { label: "Total pengguna", nilai: total, ikon: Users },
          { label: "Relawan aktif", nilai: relawanAktif, ikon: UserCheck, warna: "hijau" },
          { label: "Petugas lapangan", nilai: petugas, ikon: HardHat, warna: "ungu" },
          { label: "Akun nonaktif", nilai: nonaktif, ikon: UserX, warna: "kuning" },
        ]}
      />
      <Kartu judul="Daftar pengguna">
        <Pencarian action="/admin/user" q={q} placeholder="Cari nama atau email">
          <div className="w-44">
            <select name="role" defaultValue={role} className="min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs">
              <option value="">Semua peran</option>
              {roles.map((r) => (
                <option key={r.id} value={r.kode}>
                  {r.nama}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Nama pengguna", "Peran", "Wilayah", "Status", "Bergabung", "Aksi"]}>
          {data.map((u) => (
            <tr key={u.id}>
              <td>
                <p className="font-semibold">{u.nama}</p>
                <p className="text-redup">{u.email}</p>
              </td>
              <td>{u.role.nama}</td>
              <td>{u.wilayah?.nama ?? "-"}</td>
              <td>{u.aktif ? <Lencana warna="hijau">Aktif</Lencana> : <Lencana warna="kuning">Nonaktif</Lencana>}</td>
              <td className="whitespace-nowrap text-redup">{u.createdAt.toLocaleDateString("id-ID", { dateStyle: "medium" })}</td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <Link href={`/admin/user/${u.id}`} className="hover:underline">
                  Edit
                </Link>
                {" · "}
                <TombolHapus
                  aksi={hapusUser.bind(null, u.id)}
                  konfirmasi={`Hapus pengguna "${u.nama}"?`}
                  className="font-semibold text-laut hover:underline"
                />
              </td>
            </tr>
          ))}
        </Tabel>
        <JumlahData n={data.length} total={total} />
      </Kartu>
    </>
  );
}
