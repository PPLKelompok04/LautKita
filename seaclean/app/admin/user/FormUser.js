"use client";

import { useActionState } from "react";
import { Centang, Input, PesanError, Select } from "@/components/admin/Field";
import { AksiForm } from "@/components/admin/Tombol";
import InputFile from "@/components/InputFile";
import { simpanUser } from "./actions";

export default function FormUser({ user, roles, wilayah }) {
  const [state, aksi] = useActionState(simpanUser.bind(null, user?.id ?? null), {});
  const v = state.nilai ?? user ?? { aktif: true };

  return (
    <form action={aksi} className="flex flex-col gap-3">
      <PesanError pesan={state.pesan} />
      <Input label="Nama lengkap" name="nama" defaultValue={v.nama} required />
      <Input label="Email" name="email" type="email" defaultValue={v.email} required />
      <Input label="Nomor telepon" name="noTelepon" defaultValue={v.noTelepon ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Role"
          name="roleId"
          defaultValue={v.roleId}
          opsi={Object.fromEntries(roles.map((r) => [r.id, r.nama]))}
          kosong="Pilih role"
        />
        <Select label="Wilayah" name="wilayahId" defaultValue={v.wilayahId ?? ""} opsi={wilayah} kosong="(tidak dipilih)" />
      </div>
      <Input
        label={user ? "Password baru (kosongkan jika tidak diganti)" : "Password"}
        name="password"
        type="password"
        autoComplete="new-password"
      />
      <InputFile name="fotoUrl" label="Foto profil" folder="user" defaultValue={v.fotoUrl} />
      <Centang label="Akun aktif" name="aktif" defaultChecked={v.aktif === true || v.aktif === "on"} />
      <AksiForm batal="/admin/user" />
    </form>
  );
}
