"use client";

import { useActionState } from "react";

// Pengganti useActionState untuk form yang punya <select> atau radio.
// Setelah Server Action membalas (mis. gagal validasi), React mengosongkan form: input teks terisi lagi
// lewat defaultValue, tapi pilihan <select>/radio kembali ke opsi pertama. `state.n` naik tiap balasan;
// pakai sebagai key di <form key={state.n ?? 0}> supaya form dipasang ulang dengan nilai terakhir.
export function useAksiForm(aksi) {
  return useActionState(async (prev, formData) => ({ ...(await aksi(prev, formData)), n: (prev.n ?? 0) + 1 }), {});
}
