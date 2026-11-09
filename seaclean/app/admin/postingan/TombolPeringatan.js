"use client";

import { useState, useTransition } from "react";
import { kirimPeringatan, ubahPeringatan, hapusPeringatan } from "./actions";

const PESAN_CEPAT = [
  "Postingan Anda disembunyikan karena terindikasi penipuan.",
  "Postingan Anda mengandung unsur SARA / ujaran kebencian.",
  "Postingan Anda berisi informasi yang belum terverifikasi (hoaks).",
  "Postingan Anda mengandung spam / promosi yang tidak relevan.",
  "Postingan Anda mengandung konten ilegal atau membahayakan lingkungan.",
];

export default function TombolPeringatan({ id, penulis, riwayat = [], sudahDisembunyikan }) {
  const [buka, setBuka] = useState(false);
  const [pesan, setPesan] = useState("");
  const [sembunyikan, setSembunyikan] = useState(!sudahDisembunyikan);
  const [galat, setGalat] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPesan, setEditPesan] = useState("");
  const [pending, startTransition] = useTransition();

  function tutup() {
    setBuka(false);
    setPesan("");
    setGalat("");
    setEditId(null);
    setEditPesan("");
  }

  function kirim() {
    startTransition(async () => {
      const hasil = await kirimPeringatan(id, pesan, sembunyikan && !sudahDisembunyikan);
      if (hasil?.pesan) {
        setGalat(hasil.pesan);
        return;
      }
      tutup();
    });
  }

  function simpanEdit() {
    startTransition(async () => {
      const hasil = await ubahPeringatan(editId, editPesan);
      if (hasil?.pesan) {
        setGalat(hasil.pesan);
        return;
      }
      setGalat("");
      setEditId(null);
      setEditPesan("");
    });
  }

  function hapus(idPeringatan) {
    if (!confirm("Hapus pesan peringatan ini?")) return;
    startTransition(async () => {
      const hasil = await hapusPeringatan(idPeringatan);
      if (hasil?.pesan) setGalat(hasil.pesan);
    });
  }

  return (
    <>
      <button type="button" onClick={() => setBuka(true)} className="font-semibold text-laut hover:underline">
        Kirim peringatan
      </button>

      {buka && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => e.target === e.currentTarget && tutup()}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-left font-normal text-slate-800 shadow-xl">
            <h3 className="text-lg font-bold">Kirim pesan peringatan</h3>
            <p className="mt-1 text-xs text-slate-500">
              Untuk <span className="font-semibold">{penulis}</span>
            </p>

            {riwayat.length > 0 && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">
                <p className="mb-2 font-semibold">Peringatan sebelumnya</p>
                <ul className="space-y-3">
                  {riwayat.map((r) => (
                    <li key={r.id}>
                      <span className="text-slate-500">{r.waktu}</span>
                      {editId === r.id ? (
                        <div className="mt-1">
                          <textarea
                            value={editPesan}
                            onChange={(e) => setEditPesan(e.target.value)}
                            rows={3}
                            maxLength={500}
                            className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-sky-500"
                          />
                          <div className="mt-1 flex gap-3 font-semibold">
                            <button type="button" disabled={pending} onClick={simpanEdit} className="text-sky-700 hover:underline disabled:opacity-60">
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditId(null);
                                setGalat("");
                              }}
                              className="text-slate-500 hover:underline"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p>{r.pesan}</p>
                          <div className="mt-1 flex gap-3 font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setEditId(r.id);
                                setEditPesan(r.pesan);
                                setGalat("");
                              }}
                              className="text-sky-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button type="button" disabled={pending} onClick={() => hapus(r.id)} className="text-red-600 hover:underline disabled:opacity-60">
                              Hapus
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-xs font-semibold">Pilihan cepat</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PESAN_CEPAT.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPesan(p)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-left text-xs hover:bg-slate-50"
                >
                  {p}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold">Pesan baru</label>
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Tulis pesan peringatan untuk penulis..."
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500"
            />
            <p className="text-right text-[11px] text-slate-400">{pesan.length}/500</p>

            {!sudahDisembunyikan && (
              <label className="mt-2 flex items-center gap-2 text-xs">
                <input type="checkbox" checked={sembunyikan} onChange={(e) => setSembunyikan(e.target.checked)} />
                Sembunyikan postingan ini sekaligus
              </label>
            )}

            {galat && <p className="mt-3 text-xs font-semibold text-red-600">{galat}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={tutup} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
                Tutup
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={kirim}
                className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {pending ? "Mengirim..." : "Kirim peringatan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}