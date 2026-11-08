"use client";

import { useActionState, useState } from "react";
import { Input, PesanError, Select, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { LABEL_MONITORING, LABEL_STATUS_PROGRAM } from "@/lib/validasi/program";
import { isiTanggal } from "@/lib/validasi/umum";
import { simpanProgram } from "./actions";

export default function FormProgram({ program, daftarLokasi, daftarSpesies }) {
  const [state, aksi] = useActionState(simpanProgram.bind(null, program?.id ?? null), {});
  const v = state.nilai ?? {
    ...program,
    status: program?.status ?? "DRAF",
    monitoring: program?.monitoring ?? "DUA_MINGGUAN",
    tanggalMulai: isiTanggal(program?.tanggalMulai),
    tanggalSelesai: isiTanggal(program?.tanggalSelesai),
    batasPendaftaran: isiTanggal(program?.batasPendaftaran),
  };

  const [lokasiId, setLokasiId] = useState(String(v.lokasiId ?? ""));
  const lokasi = daftarLokasi.find((l) => String(l.id) === lokasiId);

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input label="Nama program" wajib name="nama" defaultValue={v.nama} />
        <Input label="Penyelenggara" wajib name="penyelenggara" defaultValue={v.penyelenggara} placeholder="mis. Komunitas Pesisir Bedono" />
      </div>
      <Textarea label="Deskripsi program" wajib name="deskripsi" rows={2} defaultValue={v.deskripsi ?? ""} />
      <div className="grid gap-2 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Select
            label="Lokasi / titik kumpul"
            wajib
            name="lokasiId"
            value={lokasiId}
            onChange={(e) => setLokasiId(e.target.value)}
            opsi={Object.fromEntries(daftarLokasi.map((l) => [l.id, l.nama]))}
            kosong="Pilih lokasi budidaya"
          />
        </div>
        <Input label="Lintang" value={lokasi?.latitude ?? ""} readOnly />
        <Input label="Bujur" value={lokasi?.longitude ?? ""} readOnly />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Input label="Tanggal mulai" wajib name="tanggalMulai" type="date" defaultValue={v.tanggalMulai} />
        <Input label="Tanggal selesai" wajib name="tanggalSelesai" type="date" defaultValue={v.tanggalSelesai} />
        <Input label="Batas pendaftaran" wajib name="batasPendaftaran" type="date" defaultValue={v.batasPendaftaran} />
        <Input label="Waktu penanaman" wajib name="waktuPenanaman" defaultValue={v.waktuPenanaman} placeholder="07.00–11.00 WIB" />
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <Input label="Kapasitas peserta" wajib name="kuotaPeserta" type="number" min="1" defaultValue={v.kuotaPeserta ?? ""} />
        <Input label="Target bibit" wajib name="targetBibit" type="number" min="1" defaultValue={v.targetBibit ?? ""} />
        <div className="sm:col-span-2">
          <Select
            label="Spesies"
            wajib
            name="spesiesId"
            defaultValue={v.spesiesId}
            opsi={Object.fromEntries(daftarSpesies.map((s) => [s.id, `${s.namaLokal} · ${s.namaIlmiah ?? ""}`]))}
            kosong="Pilih spesies"
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-4">
        <Input label="Pendamping" wajib name="pendamping" defaultValue={v.pendamping} />
        <Select label="Monitoring" wajib name="monitoring" defaultValue={v.monitoring} opsi={LABEL_MONITORING} />
        <div className="sm:col-span-2">
          <Textarea label="Persyaratan peserta" wajib name="persyaratan" rows={2} defaultValue={v.persyaratan ?? ""} />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <InputFile name="fotoUrl" label="Foto sampul" folder="program" defaultValue={v.fotoUrl} />
        <Select label="Status program" wajib name="status" defaultValue={v.status} opsi={LABEL_STATUS_PROGRAM} />
      </div>
      <AksiForm batal="/admin/program" simpan={program ? "Simpan perubahan" : "Simpan program"} />
    </form>
  );
}
