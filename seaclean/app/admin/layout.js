import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import Sidebar, { Breadcrumb } from "@/components/admin/Sidebar";
import TombolKeluar from "@/components/TombolKeluar";

const NAMA_ROLE = { ADMIN: "Admin", PETUGAS: "Petugas lapangan", RELAWAN: "Relawan" };

async function ProfilAdmin() {
  const session = await getSession();
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

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[76px] items-center justify-between border-b border-garis bg-white px-4 md:px-8">
          <Breadcrumb />
          <div className="flex items-center gap-3">
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
