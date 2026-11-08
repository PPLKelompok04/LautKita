import Link from "next/link";
import { Suspense } from "react";
import { ShieldAlert, ShieldCheck, ShieldHalf, Waves } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_KERAWANAN } from "@/lib/validasi/rawanAbrasi";
import { hapusRawanAbrasi } from "./actions";

export const metadata = { title: "Lokasi Rawan Abrasi - LautKita" };

const WARNA_KERAWANAN = { RENDAH: "hijau", SEDANG: "kuning", TINGGI: "merah" };

export default function RawanAbrasiPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Lokasi rawan abrasi"
        keterangan="PBI-08 · Titik pesisir yang rentan abrasi, dasar peta budidaya & dampak mangrove."
        tambah={{ href: "/admin/rawan-abrasi/baru", label: "Tambah titik" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", kerawanan = "" } = await searchParams;
  const [data, total, perTingkat] = await Promise.all([
    prisma.lokasiRawanAbrasi.findMany({
      where: {
        OR: [
          { nama: { contains: q, mode: "insensitive" } },
          { wilayah: { nama: { contains: q, mode: "insensitive" } } },
        ],
        ...(LABEL_KERAWANAN[kerawanan] ? { tingkatKerawanan: kerawanan } : {}),
      },
      include: { wilayah: { select: { nama: true, provinsi: true } } },
      orderBy: { tanggalPendataan: "desc" },
    }),
    prisma.lokasiRawanAbrasi.count(),
    prisma.lokasiRawanAbrasi.groupBy({ by: ["tingkatKerawanan"], _count: true }),
  ]);
  const jumlah = (t) => perTingkat.find((x) => x.tingkatKerawanan === t)?._count ?? 0;

  return (
    <>
      <Statistik
        data={[
          { label: "Total titik", nilai: total, ikon: Waves },
          { label: "Kerawanan tinggi", nilai: jumlah("TINGGI"), ikon: ShieldAlert, warna: "merah" },
          { label: "Kerawanan sedang", nilai: jumlah("SEDANG"), ikon: ShieldHalf, warna: "kuning" },
          { label: "Kerawanan rendah", nilai: jumlah("RENDAH"), ikon: ShieldCheck, warna: "hijau" },
        ]}
      />
      <Kartu judul="Daftar titik rawan abrasi">
        <Pencarian action="/admin/rawan-abrasi" q={q} placeholder="Cari nama titik atau wilayah">
          <div className="w-44">
            <select name="kerawanan" defaultValue={kerawanan} className="min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs">
              <option value="">Semua tingkat</option>
              {Object.entries(LABEL_KERAWANAN).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Titik", "Wilayah", "Kerawanan", "Laju abrasi", "Pendataan", "Aksi"]}>
          {data.map((r) => (
            <tr key={r.id}>
              <td>
                <p className="font-semibold">{r.nama}</p>
                <p className="text-redup">
                  {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                </p>
              </td>
              <td>{r.wilayah ? `${r.wilayah.nama}, ${r.wilayah.provinsi}` : "-"}</td>
              <td>
                <Lencana warna={WARNA_KERAWANAN[r.tingkatKerawanan]}>{LABEL_KERAWANAN[r.tingkatKerawanan]}</Lencana>
              </td>
              <td>{r.lajuAbrasiMPerTahun != null ? `${r.lajuAbrasiMPerTahun} m/tahun` : "-"}</td>
              <td className="whitespace-nowrap text-redup">{r.tanggalPendataan.toLocaleDateString("id-ID", { dateStyle: "medium" })}</td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <Link href={`/admin/rawan-abrasi/${r.id}`} className="hover:underline">
                  Edit
                </Link>
                {" · "}
                <TombolHapus
                  aksi={hapusRawanAbrasi.bind(null, r.id)}
                  konfirmasi={`Hapus titik "${r.nama}"?`}
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
