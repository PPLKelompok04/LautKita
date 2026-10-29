import Link from "next/link";
import { Suspense } from "react";
import { Fish, MapPin, Shell, TreePalm } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_EKOSISTEM } from "@/lib/validasi/lokasi";
import { hapusLokasi } from "./actions";

export const metadata = { title: "Lokasi Budidaya - LautKita" };

export default function LokasiPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Lokasi budidaya & zona"
        keterangan="PBI-02 · Lokasi budidaya terumbu karang, ikan, dan mangrove beserta pembagian zonanya."
        tambah={{ href: "/admin/lokasi/baru", label: "Tambah lokasi" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", ekosistem = "" } = await searchParams;
  const [data, total, perEkosistem] = await Promise.all([
    prisma.lokasiBudidaya.findMany({
      where: {
        nama: { contains: q, mode: "insensitive" },
        ...(LABEL_EKOSISTEM[ekosistem] ? { ekosistem } : {}),
      },
      include: { wilayah: { select: { nama: true, provinsi: true } }, _count: { select: { zona: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.lokasiBudidaya.count(),
    prisma.lokasiBudidaya.groupBy({ by: ["ekosistem"], _count: true }),
  ]);
  const jumlah = (e) => perEkosistem.find((x) => x.ekosistem === e)?._count ?? 0;

  return (
    <>
      <Statistik
        data={[
          { label: "Total lokasi", nilai: total, ikon: MapPin },
          { label: "Terumbu karang", nilai: jumlah("KARANG"), ikon: Shell, warna: "ungu" },
          { label: "Budidaya ikan", nilai: jumlah("IKAN"), ikon: Fish, warna: "biru" },
          { label: "Mangrove", nilai: jumlah("MANGROVE"), ikon: TreePalm, warna: "hijau" },
        ]}
      />
      <Kartu judul="Daftar lokasi budidaya">
        <Pencarian action="/admin/lokasi" q={q} placeholder="Cari nama lokasi">
          <div className="w-44">
            <select name="ekosistem" defaultValue={ekosistem} className="min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs">
              <option value="">Semua ekosistem</option>
              {Object.entries(LABEL_EKOSISTEM).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Lokasi", "Ekosistem", "Wilayah", "Koordinat", "Zona", "Aksi"]}>
          {data.map((l) => (
            <tr key={l.id}>
              <td className="font-semibold">{l.nama}</td>
              <td>
                <Lencana warna="biru">{LABEL_EKOSISTEM[l.ekosistem]}</Lencana>
              </td>
              <td>{l.wilayah ? `${l.wilayah.nama}, ${l.wilayah.provinsi}` : "-"}</td>
              <td className="whitespace-nowrap text-redup">
                {l.latitude.toFixed(4)}, {l.longitude.toFixed(4)}
              </td>
              <td>{l._count.zona}</td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <Link href={`/admin/lokasi/${l.id}`} className="hover:underline">
                  Edit & zona
                </Link>
                {" · "}
                <TombolHapus
                  aksi={hapusLokasi.bind(null, l.id)}
                  konfirmasi={`Hapus lokasi "${l.nama}" beserta semua zonanya?`}
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
