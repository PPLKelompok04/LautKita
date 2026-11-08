"use client";

import { useActionState } from "react";
import { Input, PesanError, Textarea } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import { ROLE_SISTEM } from "@/lib/validasi/user";
import { simpanRole } from "./actions";

export default function FormRole({ role }) {
  const [state, aksi] = useActionState(simpanRole.bind(null, role?.id ?? null), {});
  const v = state.nilai ?? role ?? {};
  const bawaan = ROLE_SISTEM.includes(role?.kode);

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Kode (huruf besar, mis. KOORDINATOR)" name="kode" defaultValue={v.kode} readOnly={bawaan} required />
      <Input label="Nama" name="nama" defaultValue={v.nama} required />
      <Textarea label="Deskripsi" name="deskripsi" defaultValue={v.deskripsi ?? ""} />
      <AksiForm batal="/admin/role" />
    </form>
  );
}
