"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FileUp } from "lucide-react";
import { PesanError } from "@/components/admin/Field";
import { kelasTombolKedua, kelasTombolUtama } from "@/components/admin/kelas";
import { importKategori } from "../actions";

const KOLOM = ["nama", "jenis", "tingkat_keparahan", "warna_peta", "deskripsi", "aktif"];

// Baca CSV sederhana (pemisah koma atau titik koma, mendukung teks dalam tanda kutip)
function bacaCsv(teks) {
  const baris = [];
  let sel = "";
  let isi = [];
  let kutip = false;
  const pemisah = (teks.split("\n")[0].match(/;/g)?.length ?? 0) > (teks.split("\n")[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (kutip) {
      if (c === '"' && teks[i + 1] === '"') (sel += '"'), i++;
      else if (c === '"') kutip = false;
      else sel += c;
    } else if (c === '"') kutip = true;
    else if (c === pemisah) isi.push(sel), (sel = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      isi.push(sel), baris.push(isi), (isi = []), (sel = "");
    } else sel += c;
  }
  if (sel || isi.length) isi.push(sel), baris.push(isi);
  return baris.filter((b) => b.some((s) => s.trim()));
}

export default function FormImport() {
  const [baris, setBaris] = useState([]);
  const [galat, setGalat] = useState("");
  const [hasil, setHasil] = useState(null);
  const [pending, startTransition] = useTransition();

  async function pilih(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setHasil(null);
    setGalat("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) return setGalat("File harus berformat .csv");
    const data = bacaCsv((await file.text()).replace(/^﻿/, ""));
    if (data.length < 2) return setGalat("CSV harus berisi baris judul kolom dan minimal satu baris data");
    const judul = data[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    if (!judul.includes("nama") || !judul.includes("jenis") || !judul.includes("tingkat_keparahan")) {
      return setGalat("Kolom wajib: nama, jenis, tingkat_keparahan. Gunakan template di bawah.");
    }
    setBaris(data.slice(1).map((b) => Object.fromEntries(judul.map((h, i) => [h, (b[i] ?? "").trim()]))));
  }

  function kirim() {
    startTransition(async () => {
      const h = await importKategori(baris);
      if (h?.pesan) return setGalat(h.pesan);
      setHasil(h);
      setBaris([]);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PesanError pesan={galat} />
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${kelasTombolUtama} cursor-pointer`}>
          <FileUp size={18} /> Pilih file CSV
          <input type="file" accept=".csv,text/csv" onChange={pilih} className="sr-only" />
        </label>
        <a href="/template-kategori-pencemaran.csv" download className={kelasTombolKedua}>
          Unduh template CSV
        </a>
      </div>
      <p className="text-xs text-redup">
        Kolom: <code>{KOLOM.join(", ")}</code>. Jenis: Sampah / Limbah / Minyak / Alat Tangkap Merusak. Keparahan: Tidak Parah /
        Sedang / Parah. Warna boleh dikosongkan (ikut keparahan). Aktif: ya/tidak (kosong = ya). Nama yang sudah ada dilewati.
      </p>

      {baris.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-teks">Pratinjau {baris.length} baris</p>
          <div className="max-h-80 overflow-auto rounded-xl border border-garis">
            <table className="w-full text-left text-xs">
              <thead className="bg-latar text-[10px] uppercase text-redup">
                <tr>
                  {KOLOM.map((k) => (
                    <th key={k} className="px-3 py-2">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {baris.map((b, i) => (
                  <tr key={i} className="border-t border-garis">
                    {KOLOM.map((k) => (
                      <td key={k} className="px-3 py-1.5">
                        {b[k]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setBaris([])} className={kelasTombolKedua}>
              Batal
            </button>
            <button type="button" disabled={pending} onClick={kirim} className={kelasTombolUtama}>
              {pending ? "Mengimpor..." : `Import ${baris.length} kategori`}
            </button>
          </div>
        </div>
      )}

      {hasil && (
        <div className="flex flex-col gap-2 rounded-xl border border-garis p-3 text-sm">
          <p className="font-semibold text-teks">
            {hasil.dibuat} kategori ditambahkan, {hasil.dilewati.length} dilewati (sudah ada), {hasil.gagal.length} gagal.
          </p>
          {hasil.dilewati.length > 0 && (
            <p className="text-xs text-redup">Dilewati: {hasil.dilewati.map((d) => `baris ${d.baris} (${d.nama})`).join(", ")}</p>
          )}
          {hasil.gagal.length > 0 && (
            <ul className="list-disc pl-5 text-xs text-red-700">
              {hasil.gagal.map((g) => (
                <li key={g.baris}>
                  Baris {g.baris} {g.nama && `(${g.nama})`}: {g.pesan}
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/kategori-pencemaran" className="w-fit text-xs font-semibold text-laut hover:underline">
            Lihat daftar kategori
          </Link>
        </div>
      )}
    </div>
  );
}
