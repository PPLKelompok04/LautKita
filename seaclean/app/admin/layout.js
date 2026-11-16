import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Bell } from "lucide-react";
import { getSession } from "@/lib/auth";
import { jumlahBelumDibaca } from "@/lib/notifikasi";
import Sidebar, { Breadcrumb } from "@/components/admin/Sidebar";
import TombolKeluar from "@/components/TombolKeluar";

const NAMA_ROLE = { ADMIN: "Admin", PETUGAS: "Petugas lapangan", RELAWAN: "Relawan" };

async function ProfilAdmin() {
  await connection();
  let session = null;
  try {
    session = await getSession();
  } catch (e) {
    session = null;
  }
  
  const nama = session?.user?.name ?? "";
  const inisial = nama
    .split(" ")
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-[10px] bg-laut text-xs font-bold text-white">{inisial}</div>
      <div className="hidden leading-normal sm:block">
        <p className="text-xs font-bold text-teks">{nama}</p>
        <p className="text-[10px] text-redup">{NAMA_ROLE[session?.user?.role] ?? ""}</p>
      </div>
    </div>
  );
}

async function SidebarSesi() {
  await connection();
  let session = null;
  try {
    session = await getSession();
  } catch (e) {
    session = null;
  }
  return <Sidebar role={session?.user?.role} akses={session?.user?.akses} />;
}

// Lonceng notifikasi di header panel (petugas menerima tugas tindak lanjut lewat notifikasi)
async function LoncengNotifikasi() {
  await connection();
  const session = await getSession();
  if (!session?.user) return null;
  const belum = await jumlahBelumDibaca(session.user.id);
  return (
    <Link href="/notifikasi" aria-label="Notifikasi" className="relative rounded-[10px] p-2 text-laut hover:bg-latar">
      <Bell size={18} />
      {belum > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {belum > 9 ? "9+" : belum}
        </span>
      )}
    </Link>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <Suspense fallback={<Sidebar />}>
        <SidebarSesi />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[76px] items-center justify-between border-b border-garis bg-white px-4 md:px-8">
          <Breadcrumb />
          <div className="flex items-center gap-3">
            <Link href="/timeline" className="rounded-[10px] px-3 py-1.5 text-xs font-semibold text-laut hover:bg-latar">
              Timeline
            </Link>
            <Suspense>
              <LoncengNotifikasi />
            </Suspense>
            <Suspense>
              <ProfilAdmin />
            </Suspense>
            <TombolKeluar className="text-xs font-semibold text-laut md:hidden" />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}