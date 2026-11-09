"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/timeline", label: "Timeline" },
  { href: "/lapor", label: "Lapor pencemaran" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/program", label: "Program budidaya" },
  { href: "/monitoring", label: "Monitoring" },
];

export default function MenuAnggota() {
  return (
    <Suspense fallback={<Daftar />}>
      <DaftarAktif />
    </Suspense>
  );
}

function DaftarAktif() {
  return <Daftar aktif={usePathname()} />;
}

function Daftar({ aktif = "" }) {
  return (
    <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
      {MENU.map((m) => {
        const dipilih = aktif.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            className={`whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-xs font-semibold ${
              dipilih ? "border-laut text-laut" : "border-transparent text-redup hover:text-teks"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
