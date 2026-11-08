import Link from "next/link";
import { Suspense } from "react";
import { Database, Sprout, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, kode, Lencana, Memuat, Pencarian, PesanInfo, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_EKOSISTEM } from "@/lib/validasi/lokasi";
import { BATAS_STOK_TERBATAS } from "@/lib/validasi/spesies";
import { hapusSpesies } from "./actions";
import FormSpesies from "./FormSpesies";
import FormBibit from "./FormBibit";

export const metadata = { title: "Spesies & Bibit - LautKita" };

// ?pilih=ID untuk edit
export default function SpesiesPage({ searchParams }) {
  return (
    <>
      <Judul
        judul="Spesies & bibit"
        keterangan="PBI-03 · Kelola katalog, panduan tanam, dan stok bibit yang tersedia untuk program."
        tambah={{ href: "/admin/spesies", label: "Tambah spesies" }}
      />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const totalStok = (s) => s.bibit.reduce((n, b) => n + b.stok, 0);

async function IsiHalaman({ searchParams }) {
  const { q = "", pilih } = await searchParams;
  const idPilih = Number(pilih);

  const [daftar, dipilih] = await Promise.all([
    prisma.spesies.findMany({
      where: {
        OR: [
          { namaLokal: { contains: q, mode: "insensitive" } },
          { namaIlmiah: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { bibit: { select: { stok: true } } },
      orderBy: { namaLokal: "asc" },
    }),
    Number.isInteger(idPilih) && idPilih > 0
      ? prisma.spesies.findUnique({ where: { id: idPilih }, include: { bibit: { orderBy: { id: "asc" } } } })
      : null,
  ]);

  return (
    <div className="flex flex-col items-start gap-4 lg:flex-row">
      <div className="flex w-full flex-col gap-3 lg:w-[460px] lg:shrink-0">
        <Kartu judul={`Daftar spesies · ${daftar.length}`}>
          <Pencarian action="/admin/spesies" q={q} placeholder="Cari nama spesies" />
          <Tabel kolom={["Spesies", "Kategori", "Stok bibit", "Aksi"]}>
            {daftar.map((s) => {
              const stok = totalStok(s);
              return (
                <tr key={s.id} className={s.id === dipilih?.id ? "bg-laut-muda" : ""}>
                  <td className="font-semibold">
                    <p>{s.namaLokal}</p>
                    <p className="font-normal italic text-redup">{s.namaIlmiah}</p>
                    {!s.aktif && <Lencana>Nonaktif</Lencana>}
                  </td>
                  <td>{LABEL_EKOSISTEM[s.ekosistem]}</td>
                  <td>
                    <p>{stok.toLocaleString("id-ID")}</p>
                    <p className={stok < BATAS_STOK_TERBATAS ? "text-amber-700" : "text-redup"}>
                      {stok < BATAS_STOK_TERBATAS ? "Terbatas" : "Tersedia"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap font-semibold text-laut">
                    <Link href={`/admin/spesies?pilih=${s.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className="hover:underline">
                      Edit
                    </Link>
                    {" · "}
                    <TombolHapus
                      aksi={hapusSpesies.bind(null, s.id)}
                      konfirmasi={`Hapus spesies "${s.namaLokal}" beserta stok bibitnya?`}
                      className="font-semibold text-laut hover:underline"
                    />
                  </td>
                </tr>
              );
            })}
          </Tabel>
          <JumlahData n={daftar.length} />
        </Kartu>

        <Kartu judul="Sebelum menghapus">
          <p className="text-[13px] text-redup">
            Spesies yang terhubung dengan program tidak dapat dihapus. Gunakan status <b>Nonaktif</b> untuk
            menyembunyikannya dari katalog.
          </p>
          <div className="flex items-center gap-2 rounded-[10px] bg-bahaya-muda px-3.5 py-2.5 text-xs text-redup">
            <Trash2 size={18} className="shrink-0 text-red-600" />
            Tombol Hapus akan menolak spesies yang masih dipakai program.
          </div>
        </Kartu>

        <PesanInfo judul="Stok bukan jumlah tertanam" ikon={Database}>
          Ketersediaan bibit pada katalog dikelola terpisah dari hasil monitoring tiap program.
        </PesanInfo>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
        <Kartu
          judul={dipilih ? "Edit spesies & bibit" : "Tambah spesies"}
          kanan={
            dipilih && (
              <Lencana warna="biru">
                <Sprout size={13} />
                {kode("SP", dipilih.id)}
              </Lencana>
            )
          }
        >
          <FormSpesies key={dipilih?.id ?? "baru"} spesies={dipilih} totalStok={dipilih ? totalStok(dipilih) : 0} />
        </Kartu>

        {dipilih && (
          <Kartu judul="Stok bibit">
            <p className="text-xs text-redup">Setiap batch bibit dicatat terpisah. Total stok = jumlah semua batch.</p>
            <div className="flex flex-col divide-y divide-garis">
              {dipilih.bibit.map((b) => (
                <FormBibit key={b.id} spesiesId={dipilih.id} bibit={b} />
              ))}
              <FormBibit spesiesId={dipilih.id} />
            </div>
          </Kartu>
        )}
        <p className="text-[11px] text-redup">Perubahan katalog akan tampil pada detail spesies di aplikasi setelah disimpan.</p>
      </div>
    </div>
  );
}
