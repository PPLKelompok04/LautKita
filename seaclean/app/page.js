import Image from "next/image";
import Link from "next/link";
import { kelasTombolKedua, kelasTombolUtama } from "@/components/admin/kelas";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-laut p-8 text-center">
      <Image src="/lautkita-logo.svg" alt="" width={64} height={64} priority />
      <div>
        <h1 className="text-4xl font-extrabold text-white">LAUTKITA</h1>
        <p className="text-sm text-laut-pucat">Platform Komunitas Pelestarian Laut</p>
      </div>
      <p className="max-w-md text-sm text-white/85">
        Budidaya terumbu karang, ikan, dan mangrove, pelaporan pencemaran, serta timeline komunitas dalam satu tempat.
      </p>
      <div className="flex gap-3">
        <Link href="/timeline" className={`${kelasTombolUtama} border-white bg-white text-laut`}>
          Buka timeline
        </Link>
        <Link href="/admin" className={`${kelasTombolKedua} border-white/40 bg-transparent text-white hover:bg-white/10`}>
          Panel admin
        </Link>
      </div>
    </main>
  );
}
