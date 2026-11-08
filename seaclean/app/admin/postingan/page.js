import { Suspense } from "react";
import { connection } from "next/server";
import { CalendarRange, Eye, EyeOff, MessagesSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { JumlahData, Judul, Kartu, Lencana, Memuat, Pencarian, Statistik, Tabel } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { LABEL_STATUS_POSTINGAN } from "@/lib/validasi/postingan";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { hapusPostingan } from "@/app/timeline/actions";
import TombolStatus from "./TombolStatus";

export const metadata = { title: "Moderasi Postingan - LautKita" };

const hariLalu = (n) => new Date(Date.now() - n * 24 * 3600 * 1000);

export default function PostinganPage({ searchParams }) {
  return (
    <>
      <Judul judul="Moderasi postingan" keterangan="PBI-06 · Pantau dan moderasi postingan timeline komunitas." />
      <Suspense fallback={<Memuat />}>
        <IsiHalaman searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function IsiHalaman({ searchParams }) {
  const { q = "", status = "" } = await searchParams;
  await connection();
  const seminggu = hariLalu(7);

  const [data, total, tampil, disembunyikan, mingguIni] = await Promise.all([
    prisma.postingan.findMany({
      where: {
        OR: [
          { isi: { contains: q, mode: "insensitive" } },
          { penulis: { nama: { contains: q, mode: "insensitive" } } },
        ],
        ...(LABEL_STATUS_POSTINGAN[status] ? { status } : {}),
      },
      include: { penulis: { select: { nama: true } }, tag: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.postingan.count(),
    prisma.postingan.count({ where: { status: "TAMPIL" } }),
    prisma.postingan.count({ where: { status: "DISEMBUNYIKAN" } }),
    prisma.postingan.count({ where: { createdAt: { gte: seminggu } } }),
  ]);

  return (
    <>
      <Statistik
        data={[
          { label: "Total postingan", nilai: total, ikon: MessagesSquare },
          { label: "Tampil", nilai: tampil, ikon: Eye, warna: "hijau" },
          { label: "Disembunyikan", nilai: disembunyikan, ikon: EyeOff, warna: "merah" },
          { label: "7 hari terakhir", nilai: mingguIni, ikon: CalendarRange, warna: "ungu" },
        ]}
      />
      <Kartu judul="Daftar postingan">
        <Pencarian action="/admin/postingan" q={q} placeholder="Cari isi atau penulis">
          <div className="w-44">
            <select name="status" defaultValue={status} className="min-h-[38px] w-full rounded-[10px] border border-garis bg-white px-3 text-xs">
              <option value="">Semua status</option>
              {Object.entries(LABEL_STATUS_POSTINGAN).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </Pencarian>
        <Tabel kolom={["Penulis", "Isi", "Topik", "Waktu", "Status", "Aksi"]}>
          {data.map((p) => (
            <tr key={p.id}>
              <td className="whitespace-nowrap font-semibold">{p.penulis.nama}</td>
              <td className="max-w-sm">
                <p className="line-clamp-2">{p.isi}</p>
                {p.gambarUrl && (
                  <a href={p.gambarUrl} target="_blank" rel="noreferrer" className="text-laut underline">
                    Lihat foto
                  </a>
                )}
              </td>
              <td className="text-laut">{p.tag.map((t) => `#${t.tag.nama}`).join(" ")}</td>
              <td className="whitespace-nowrap text-redup">{tampilTanggalJam(p.createdAt)}</td>
              <td>
                <Lencana warna={p.status === "TAMPIL" ? "hijau" : "merah"}>{LABEL_STATUS_POSTINGAN[p.status]}</Lencana>
              </td>
              <td className="whitespace-nowrap font-semibold text-laut">
                <TombolStatus id={p.id} status={p.status} />
                {" · "}
                <TombolHapus
                  aksi={hapusPostingan.bind(null, p.id)}
                  konfirmasi="Hapus postingan ini secara permanen?"
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
