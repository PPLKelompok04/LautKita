import Form from "next/form";
import Link from "next/link";
import { Info, Plus, Search } from "lucide-react";
import { kelasTombolUtama } from "@/components/admin/kelas";

// Komponen kerangka halaman admin (gaya mengikuti mockup Figma LAUTKITA).

export function Judul({ judul, keterangan, tambah }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[27px] font-bold leading-snug text-teks">{judul}</h1>
        {keterangan && <p className="text-[13px] text-redup">{keterangan}</p>}
      </div>
      {tambah && (
        <Link href={tambah.href} className={kelasTombolUtama}>
          <Plus size={18} />
          {tambah.label}
        </Link>
      )}
    </div>
  );
}

export function Kartu({ judul, kanan, children, className = "" }) {
  return (
    <section className={`flex flex-col gap-3 rounded-2xl border border-garis bg-white px-[18px] py-3 ${className}`}>
      {(judul || kanan) && (
        <div className="flex items-center justify-between gap-3">
          {judul && <h2 className="text-base font-bold text-teks">{judul}</h2>}
          {kanan}
        </div>
      )}
      {children}
    </section>
  );
}

// Kotak info biru muda (mis. "Stok bukan jumlah tertanam")
export function PesanInfo({ judul, children, ikon: Ikon = Info }) {
  return (
    <div className="flex gap-2 rounded-xl bg-laut-muda px-3.5 py-2.5">
      <Ikon size={20} className="shrink-0 text-laut" />
      <div className="flex flex-col gap-1">
        <p className="text-[13px] font-bold text-teks">{judul}</p>
        <p className="text-xs text-laut-tua">{children}</p>
      </div>
    </div>
  );
}

// Form pencarian (GET), hasilnya jadi ?q=...  `children` untuk filter tambahan (mis. <select>).
export function Pencarian({ action, q, placeholder = "Cari...", children }) {
  return (
    <Form action={action} className="flex flex-wrap gap-2">
      <label className="flex min-w-60 flex-1 items-center gap-2 rounded-[10px] bg-latar px-3 py-2">
        <Search size={18} className="text-redup" />
        <input name="q" defaultValue={q} placeholder={placeholder} className="w-full bg-transparent text-xs text-teks outline-none placeholder:text-redup" />
      </label>
      {children}
      <button className="rounded-[10px] border border-garis bg-white px-4 text-xs font-semibold text-laut hover:bg-latar">Cari</button>
    </Form>
  );
}

// `kolom` = daftar judul kolom; isi tabel lewat children (<tr>...</tr>)
export function Tabel({ kolom, kosong, children }) {
  const adaIsi = Array.isArray(children) ? children.length > 0 : Boolean(children);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-teks">
        <thead className="bg-latar text-[10px] font-bold uppercase text-redup">
          <tr>
            {kolom.map((k) => (
              <th key={k} className="px-3.5 py-2 font-bold">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_td]:px-3.5 [&_td]:py-3 [&_tr]:border-b [&_tr]:border-garis">
          {adaIsi ? (
            children
          ) : (
            <tr>
              <td colSpan={kolom.length} className="text-center text-redup">
                {kosong ?? "Belum ada data"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function JumlahData({ n, total }) {
  return <p className="px-1 text-[11px] text-redup">Menampilkan {n} dari {total ?? n} data</p>;
}

export function Memuat() {
  return <p className="text-sm text-redup">Memuat data...</p>;
}

const WARNA_LENCANA = {
  slate: "bg-latar text-redup border-garis",
  hijau: "bg-emerald-50 text-emerald-700 border-emerald-200",
  kuning: "bg-amber-50 text-amber-700 border-amber-200",
  merah: "bg-red-50 text-red-700 border-red-200",
  biru: "bg-laut-muda text-laut-tua border-laut-pucat",
};

export function Lencana({ children, warna = "slate" }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold ${WARNA_LENCANA[warna]}`}>
      {children}
    </span>
  );
}

const WARNA_STATISTIK = {
  biru: "bg-laut-muda text-laut",
  hijau: "bg-emerald-50 text-emerald-600",
  kuning: "bg-amber-50 text-amber-600",
  merah: "bg-red-50 text-red-600",
  ungu: "bg-indigo-50 text-indigo-600",
};

// Baris kartu statistik di atas tabel. `data` = [{ label, nilai, ikon, warna, keterangan }]
export function Statistik({ data }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
      {data.map(({ label, nilai, ikon: Ikon, warna = "biru", keterangan }) => (
        <div key={label} className="flex flex-col gap-3 rounded-2xl border border-garis bg-white p-4">
          <div className={`flex size-8 items-center justify-center rounded-lg ${WARNA_STATISTIK[warna]}`}>
            <Ikon size={18} />
          </div>
          <div>
            <p className="text-xs text-redup">{label}</p>
            <p className="text-2xl font-bold text-teks">{nilai.toLocaleString("id-ID")}</p>
            {keterangan && <p className="text-[11px] text-redup">{keterangan}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Kode tampilan seperti di mockup, mis. kode("SP", 1) → "SP-001"
export function kode(awalan, id) {
  return `${awalan}-${String(id).padStart(3, "0")}`;
}
