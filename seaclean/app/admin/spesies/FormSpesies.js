"use client";

import { useActionState } from "react";
import { Input, kelasInput, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { LABEL_EKOSISTEM } from "@/lib/validasi/lokasi";
import { LABEL_STATUS_KATALOG, LABEL_STATUS_KONSERVASI } from "@/lib/validasi/spesies";
import { simpanSpesies } from "./actions";

export default function FormSpesies({ spesies, totalStok }) {
  const [state, aksi] = useActionState(simpanSpesies.bind(null, spesies?.id ?? null), {});
  const v = state.nilai ?? { ...spesies, aktif: String(spesies?.aktif ?? true), statusKonservasi: spesies?.statusKonservasi ?? "LC" };

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <InputFile name="fotoUrl" label="Foto spesies" folder="spesies" defaultValue={v.fotoUrl} />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Input label="Nama lokal" wajib name="namaLokal" defaultValue={v.namaLokal} />
        <Input label="Nama ilmiah" wajib name="namaIlmiah" defaultValue={v.namaIlmiah ?? ""} />
        <Select label="Kategori" wajib name="ekosistem" defaultValue={v.ekosistem} opsi={LABEL_EKOSISTEM} kosong="Pilih kategori" />
        <Select label="Status katalog" wajib name="aktif" defaultValue={v.aktif} opsi={LABEL_STATUS_KATALOG} />
      </div>
      <Textarea label="Deskripsi" wajib name="deskripsi" rows={2} defaultValue={v.deskripsi ?? ""} />
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Stok tersedia"
          value={totalStok.toLocaleString("id-ID")}
          readOnly
          keterangan="Satuan: bibit · diatur di Stok bibit"
        />
        <Input label="Umur bibit" name="umurBibit" defaultValue={v.umurBibit ?? ""} placeholder="mis. 4–6 bulan" />
        <div className="sm:col-span-2">
          <Select
            label="Status konservasi (IUCN)"
            wajib
            name="statusKonservasi"
            defaultValue={v.statusKonservasi}
            opsi={LABEL_STATUS_KONSERVASI}
          />
        </div>
      </div>
      <h3 className="pt-1 text-[15px] font-bold text-teks">Syarat lokasi tanam</h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Input label="Substrat" wajib name="substrat" defaultValue={v.substrat ?? ""} placeholder="mis. Lumpur berpasir" />
        <Input label="Salinitas" wajib name="salinitas" defaultValue={v.salinitas ?? ""} placeholder="mis. 10–30 ppt" />
        <div className="sm:col-span-2">
          <Input
            label="Kondisi perairan"
            wajib
            name="kondisiPerairan"
            defaultValue={v.kondisiPerairan ?? ""}
            placeholder="mis. Zona pasang surut, ombak rendah"
          />
        </div>
      </div>
      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-semibold text-teks">Cara menanam *</span>
        <textarea
          name="caraMenanam"
          rows={3}
          defaultValue={v.caraMenanam ?? ""}
          placeholder={"1. Bersihkan lokasi...\n2. ..."}
          className={kelasInput}
        />
      </label>
      <InputFile name="dokumenUrl" label="Dokumen panduan (opsional)" jenis="dokumen" folder="spesies" defaultValue={v.dokumenUrl} />
      <AksiForm batal="/admin/spesies" simpan={spesies ? "Simpan perubahan" : "Simpan spesies"} />
    </form>
  );
}
