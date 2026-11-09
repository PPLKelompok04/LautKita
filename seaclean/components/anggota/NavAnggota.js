import Link from "next/link";
import { Suspense } from "react";
import { Bell } from "lucide-react";
import { getSession } from "@/lib/auth";
import { jumlahBelumDibaca } from "@/lib/notifikasi";
import TombolKeluar from "@/components/TombolKeluar";
import MenuAnggota from "./MenuAnggota";

// header halaman anggota
export default function NavAnggota() {
  return (
    <header className="sticky top-0 z-10 border-b border-garis bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/timeline" className="text-lg font-extrabold text-laut">
            LAUTKITA
          </Link>
          <div className="flex items-center gap-2">
            <Suspense>
              <AksiAkun />
            </Suspense>
            <TombolKeluar className="rounded-[10px] border border-garis px-3 py-1.5 text-xs font-semibold text-laut hover:bg-latar" />
          </div>
        </div>
        <MenuAnggota />
      </div>
    </header>
  );
}

async function AksiAkun() {
  const session = await getSession();
  if (!session?.user) return null;
  const belum = await jumlahBelumDibaca(session.user.id);

  return (
    <>
      {["ADMIN", "PETUGAS"].includes(session.user.role) && (
        <Link href="/admin" className="rounded-[10px] px-3 py-1.5 text-xs font-semibold text-laut hover:bg-latar">
          Panel
        </Link>
      )}
      <Link href="/notifikasi" aria-label="Notifikasi" className="relative rounded-[10px] p-2 text-laut hover:bg-latar">
        <Bell size={18} />
        {belum > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {belum > 9 ? "9+" : belum}
          </span>
        )}
      </Link>
    </>
  );
}
