"use client";

import { signOut } from "next-auth/react";

export default function TombolKeluar({ className }) {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className={className}>
      Keluar
    </button>
  );
}
