"use client";

import { Input, PesanError, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import { ROLE_SISTEM } from "@/lib/validasi/user";
import { useAksiForm } from "@/lib/useAksiForm";
import { HALAMAN_AKSES } from "../menu";
import { simpanRole } from "./actions";

export default function FormRole({ role }) {
  const [state, aksi] = useAksiForm(simpanRole.bind(null, role?.id ?? null));
  const v = state.nilai ?? role ?? {};
  const bawaan = ROLE_SISTEM.includes(role?.kode);
  const admin = role?.kode === "ADMIN";
  const dipilih = new Set(v.akses ?? []);
  const grup = [...new Set(HALAMAN_AKSES.map((h) => h.grup))];

  return (
    <form key={state.n ?? 0} action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Kode (huruf besar, mis. KOORDINATOR)" name="kode" defaultValue={v.kode} readOnly={bawaan} required />
      <Input label="Nama" name="nama" defaultValue={v.nama} required />
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi ?? ""} />

      <fieldset className="flex flex-col gap-2 rounded-xl border border-garis p-3">
        <legend className="px-1 text-[13px] font-semibold text-teks">Hak akses panel admin</legend>
        {admin ? (
          <p className="text-xs text-redup">Admin selalu bisa membuka semua halaman.</p>
        ) : (
          <>
            <p className="text-xs text-redup">
              Centang halaman yang boleh dibuka role ini. Halaman Manajemen pengguna dan Role hanya untuk Admin. Perubahan
              menu berlaku setelah pengguna login ulang; aksi simpan langsung mengikuti pengaturan ini.
            </p>
            {grup.map((g) => (
              <div key={g} className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-redup">{g}</p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {HALAMAN_AKSES.filter((h) => h.grup === g).map((h) => (
                    <label key={h.href} className="flex items-center gap-2 text-sm text-teks">
                      <input type="checkbox" name="akses" value={h.href} defaultChecked={dipilih.has(h.href)} className="size-4 accent-laut" />
                      {h.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </fieldset>
      <AksiForm batal="/admin/role" />
    </form>
  );
}
