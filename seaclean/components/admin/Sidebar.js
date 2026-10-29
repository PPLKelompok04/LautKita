"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { MENU, menuAktif } from "@/app/admin/menu";

export function Merek({ sub = "Platform admin" }) {
  return (
    <Link href="/admin" className="flex items-center gap-2.5">
      <Image src="/lautkita-logo.svg" alt="" width={38} height={38} priority />
      <span className="flex flex-col">
        <span className="text-lg font-extrabold leading-tight text-white">LAUTKITA</span>
        <span className="text-[9px] font-medium uppercase text-laut-pucat">{sub}</span>
      </span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex flex-col justify-between bg-laut px-4 py-6 md:sticky md:top-0 md:h-screen md:w-[236px] md:shrink-0 md:overflow-y-auto">
      <div className="flex flex-col gap-6">
        <Merek />
        <Suspense fallback={<Menu />}>
          <MenuAktif />
        </Suspense>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-6 hidden items-center gap-2.5 rounded-xl bg-laut-tua p-3.5 text-left text-white hover:brightness-110 md:flex"
      >
        <LogOut size={20} strokeWidth={1.75} />
        <span className="flex flex-col">
          <span className="text-xs font-semibold">Keluar</span>
          <span className="text-[10px] text-laut-pucat">Akhiri sesi admin</span>
        </span>
      </button>
    </aside>
  );
}

function MenuAktif() {
  return <Menu aktif={menuAktif(usePathname())} />;
}

function Menu({ aktif }) {
  return (
    <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] md:flex-col md:gap-4 md:overflow-visible">
      {MENU.map((g) => (
        <div key={g.grup} className="flex gap-1 md:flex-col md:gap-0.5">
          <p className="hidden pb-1 text-[10px] font-semibold uppercase text-laut-pucat md:block">{g.grup}</p>
          {g.item.map((m) => {
            const dipilih = aktif?.href === m.href;
            const Ikon = m.ikon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-[9px] p-[11px] text-xs text-white hover:bg-white/10 ${
                  dipilih ? "bg-white/15 font-bold" : ""
                }`}
              >
                <Ikon size={18} strokeWidth={1.75} />
                <span className="flex-1">{m.label}</span>
                {dipilih && <ChevronRight size={14} className="hidden md:block" />}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// Breadcrumb di bilah atas, mengikuti menu yang sedang dibuka
export function Breadcrumb() {
  return (
    <Suspense fallback={<p className="text-xs text-redup">Platform admin</p>}>
      <IsiBreadcrumb />
    </Suspense>
  );
}

function IsiBreadcrumb() {
  const aktif = menuAktif(usePathname());
  return (
    <p className="text-xs text-redup">
      Platform admin <span className="px-1.5">/</span> {aktif?.grup === "Menu utama" ? "Ringkasan" : aktif?.grup}
      {aktif && aktif.grup !== "Menu utama" && (
        <>
          <span className="px-1.5">/</span>
          <span className="text-teks">{aktif.label}</span>
        </>
      )}
    </p>
  );
}
