import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import TombolKeluar from "@/components/TombolKeluar";
import { kelasTombolKedua, kelasTombolUtama } from "@/components/admin/kelas";

export const metadata = { title: "Akses Ditolak - LautKita" };

// Tujuan proxy.js kalau user sudah login tapi role-nya tidak punya akses ke halaman admin tersebut
export default function AksesDitolakPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-latar p-6">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-garis bg-white p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={28} />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-teks">Akses ditolak</h1>
          <p className="text-sm text-redup">
            Akunmu sudah masuk, tapi peranmu tidak punya hak untuk membuka halaman ini. Hubungi admin kalau kamu
            seharusnya punya akses.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/timeline" className={kelasTombolUtama}>
            Kembali ke timeline
          </Link>
          <TombolKeluar className={kelasTombolKedua} />
        </div>
      </div>
    </main>
  );
}
