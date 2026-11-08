import Link from "next/link";
import { Suspense } from "react";
import { Anchor, CircleCheck, Siren, Tags } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_JENIS_PENCEMARAN, LABEL_KEPARAHAN } from "@/lib/validasi/kategoriPencemaran";
import { hapusKategori } from "./actions";

export const metadata = { title: "Kategori Pencemaran - LautKita" };

const WARNA_LENCANA = { RINGAN: "hijau", SEDANG: "kuning", PARAH: "merah" };

export default function KategoriPencemaranPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Kategori pencemaran"
        keterangan="PBI-07 · Jenis pencemaran dan perusakan laut, termasuk pukat harimau."
        tambah={{ href: "/admin/kategori-pencemaran/baru", label: "Tambah kategori" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "" } = await searchParams;
  const [data, total, aktif, parah, alatTangkap] = await Promise.all([
    prisma.kategoriPencemaran.findMany({
      where: { nama: { contains: q, mode: "insensitive" } },
      orderBy: { nama: "asc" },
    }),
    prisma.kategoriPencemaran.count(),
    prisma.kategoriPencemaran.count({ where: { aktif: true } }),
    prisma.kategoriPencemaran.count({ where: { tingkatKeparahan: "PARAH" } }),
    prisma.kategoriPencemaran.count({ where: { jenis: "ALAT_TANGKAP_MERUSAK" } }),
  ]);

  return (
    <>
      <Statistik
        data={[
          { label: "Total kategori", nilai: total, ikon: Tags },
          { label: "Kategori aktif", nilai: aktif, ikon: CircleCheck, warna: "hijau" },
          { label: "Tingkat parah", nilai: parah, ikon: Siren, warna: "merah" },
          { label: "Alat tangkap merusak", nilai: alatTangkap, ikon: Anchor, warna: "kuning" },
        ]}
      />
      <Kartu judul="Daftar kategori">
        <Pencarian action="/admin/kategori-pencemaran" q={q} placeholder="Cari kategori" />
        <Tabel kolom={["Kategori", "Jenis", "Keparahan", "Warna peta", "Status", "Aksi"]}>
          {data.map((k) => (
            <tr key={k.id}>
              <td>
                <p className="font-semibold">{k.nama}</p>
                {k.deskripsi && <p className="line-clamp-1 text-redup">{k.deskripsi}</p>}
              </td>
              <td>{LABEL_JENIS_PENCEMARAN[k.jenis]}</td>
              <td>
                <Lencana warna={WARNA_LENCANA[k.tingkatKeparahan]}>{LABEL_KEPARAHAN[k.tingkatKeparahan]}</Lencana>
              </td>
              <td>
                <span className="inline-flex items-center gap-2 text-redup">
                  <span className="size-4 rounded-full border border-garis" style={{ backgroundColor: k.warnaPeta }} />
                  {k.warnaPeta}
                </span>
              </td>
              <td>{k.aktif ? <Lencana warna="hijau">Aktif</Lencana> : <Lencana>Nonaktif</Lencana>}</td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <Link href={`/admin/kategori-pencemaran/${k.id}`} className="hover:underline">
                  Edit
                </Link>
                {" · "}
                <TombolHapus
                  aksi={hapusKategori.bind(null, k.id)}
                  konfirmasi={`Hapus kategori "${k.nama}"?`}
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
