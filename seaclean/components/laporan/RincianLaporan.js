import { MapPin } from "lucide-react";
import { Lencana, kode } from "@/components/admin/Halaman";
import { LABEL_STATUS_LAPORAN, WARNA_STATUS_LAPORAN, namaPelapor } from "@/lib/validasi/laporan";
import { tampilTanggalJam } from "@/lib/validasi/umum";

// isi laporan, dipakai di halaman pelapor, admin, verifikasi, dan tindak lanjut
// `laporan` harus include kategori & pelapor
export default function RincianLaporan({ laporan: l }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-redup">
            {kode("LP", l.id)} · {l.kategori.nama} · {tampilTanggalJam(l.createdAt)}
          </p>
          <h2 className="text-lg font-bold text-teks">{l.judul}</h2>
          <p className="text-xs text-redup">Pelapor: {namaPelapor(l)}</p>
        </div>
        <Lencana warna={WARNA_STATUS_LAPORAN[l.status]}>{LABEL_STATUS_LAPORAN[l.status]}</Lencana>
      </div>
      <p className="whitespace-pre-line text-sm text-teks">{l.deskripsi}</p>
      {l.fotoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={l.fotoUrl} alt="" className="max-h-80 w-full rounded-xl object-cover" />
      )}
      <a
        href={`https://www.openstreetmap.org/?mlat=${l.latitude}&mlon=${l.longitude}#map=16/${l.latitude}/${l.longitude}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-laut hover:underline"
      >
        <MapPin size={14} />
        {l.alamat ? `${l.alamat} (${l.latitude}, ${l.longitude})` : `${l.latitude}, ${l.longitude}`}
      </a>
    </div>
  );
}
