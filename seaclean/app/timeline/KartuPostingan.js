"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Lencana } from "@/components/admin/Halaman";
import { TombolHapus } from "@/components/admin/Tombol";
import { tampilTanggalJam } from "@/lib/validasi/umum";
import { hapusPostingan } from "./actions";
import FormPostingan from "./FormPostingan";

export default function KartuPostingan({ postingan: p, milikSendiri, bisaHapus }) {
  const [edit, setEdit] = useState(false);

  if (edit) return <FormPostingan postingan={p} onSelesai={() => setEdit(false)} />;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-garis bg-white p-4">
      <div className="flex items-start gap-3">
        {p.penulis.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.penulis.fotoUrl} alt="" className="size-11 rounded-full object-cover" />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-full bg-laut text-sm font-bold text-white">
            {p.penulis.nama[0]}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-teks">{p.penulis.nama}</p>
            <Lencana warna="biru">{p.penulis.role.nama}</Lencana>
          </div>
          <p className="text-xs text-redup">{tampilTanggalJam(p.createdAt)}</p>
          {p.penulis.wilayah && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-laut-muda px-2 py-0.5 text-xs text-laut-tua">
              <MapPin size={12} />
              {p.penulis.wilayah.nama}, {p.penulis.wilayah.provinsi}
            </span>
          )}
        </div>
        {p.status === "DISEMBUNYIKAN" && <Lencana warna="merah">Disembunyikan admin</Lencana>}
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-teks">{p.isi}</p>
      {p.gambarUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.gambarUrl} alt="" className="max-h-96 w-full rounded-xl object-cover" />
      )}
      {p.tag.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {p.tag.map((t) => (
            <Link key={t} href={`/timeline?tag=${encodeURIComponent(t)}`} className="text-xs font-semibold text-laut hover:underline">
              #{t}
            </Link>
          ))}
        </div>
      )}
      {(milikSendiri || bisaHapus) && (
        <div className="flex gap-4 border-t border-garis pt-2 text-xs">
          {milikSendiri && (
            <button type="button" onClick={() => setEdit(true)} className="font-semibold text-laut hover:underline">
              Edit
            </button>
          )}
          {bisaHapus && <TombolHapus aksi={hapusPostingan.bind(null, p.id)} konfirmasi="Hapus postingan ini?" />}
        </div>
      )}
    </article>
  );
}
