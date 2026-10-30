import { Suspense } from "react";
import Image from "next/image";
import FormLogin from "./FormLogin";

export const metadata = { title: "Masuk - LautKita" };

// Tampilan mengikuti mockup Figma "Login Admin" (node 202:2). Aset ada di public/login/.
const STATISTIK = [
  { ikon: "/login/ikon-globe.svg", w: 15, h: 15, rw: 15, rh: 15, nilai: "128+", warna: "text-[#c4e7ff]", label: "Wilayah Konservasi Terpantau" },
  { ikon: "/login/ikon-centang.svg", w: 15, h: 15, rw: 15, rh: 15, nilai: "99.4%", warna: "text-[#5bb8fe]", label: "Tingkat Validasi Laporan" },
  { ikon: "/login/ikon-sampah.svg", w: 15, h: 10.875, rw: 120, rh: 87, nilai: "15.8k", warna: "text-[#acedff]", label: "Kg Sampah & Pukat Terangkat" },
];

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f5faff] p-4 md:px-8 md:py-16">
      <div className="flex w-full max-w-[1216px] overflow-hidden rounded-xl bg-white shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <PanelVisual />
        <section className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-10 lg:p-14">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#d0ecff] px-3 py-1 text-[11px] font-medium text-[#004e6b]">
                <Image src="/login/ikon-rbac.svg" alt="" width={10.667} height={13.333} />
                RBAC Secured • Level Admin & Petugas Lapangan
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#70787e]">
                <span className="size-2 rounded-full bg-[#5bb8fe]" />
                NextAuth + Supabase
              </span>
            </div>
            <h1 className="pt-1.5 text-[22px] font-bold leading-7 tracking-[-0.22px] text-[#001e2c]">
              Portal Administrasi LautKita
            </h1>
            <p className="text-[13px] leading-[19px] text-[#40484d]">
              Masuk dengan kredensial tersertifikasi untuk mengelola repositori aksi pesisir dan persetujuan patroli.
            </p>
          </div>

          <Suspense>
            <FormLogin />
          </Suspense>

          <div className="flex flex-col gap-2 border-t border-[#dcf1ff] pt-[17px]">
            <p className="flex items-center gap-2 text-[11px] font-medium text-[#40484d]">
              <Image src="/login/ikon-tls.svg" alt="" width={12.667} height={14.667} />
              Protokol Enkripsi TLS 1.3 • Supabase Auth Row-Level Security (RLS)
            </p>
            <p className="text-xs leading-[19.5px] text-[#70787e]">
              Peringatan: Seluruh aktivitas autentikasi dicatat dalam Audit Trail demi integritas validasi satelit
              konservasi. Akses tidak sah akan ditindaklanjuti sesuai regulasi hukum siber nasional.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

// Panel kiri: branding dan visual laut. Disembunyikan di layar kecil.
function PanelVisual() {
  return (
    <section className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[linear-gradient(127.66deg,#004e6b_0%,#13678a_50%,#0a3446_100%)] p-14 lg:flex">
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-[rgba(91,184,254,0.1)] blur-[64px]" />
      <div className="absolute -left-20 bottom-10 size-80 rounded-full bg-[rgba(76,215,246,0.1)] blur-[40px]" />
      <Image src="/login/gelombang.svg" alt="" fill className="pointer-events-none object-fill" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 shadow-sm backdrop-blur-[8px]">
              <Image src="/login/ikon-merek.svg" alt="" width={25.667} height={24.5} />
            </span>
            <span className="flex flex-col gap-1.5 pb-1">
              <span className="text-[22px] font-bold leading-7 tracking-[-0.55px] text-white">LAUTKITA</span>
              <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[1.1px] text-[#8bcff6]">
                Marine Action Registry
              </span>
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-[#c4e7ff] backdrop-blur-[8px]">
            <Image src="/login/ikon-perisai.svg" alt="" width={10.667} height={13.333} />
            Kepatuhan UU No. 27/2022
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <span className="flex w-fit items-center gap-2 rounded-lg bg-[rgba(0,80,95,0.6)] px-2.5 py-1 text-[11px] font-medium text-[#acedff]">
            <span className="size-2 rounded-full bg-[#4cd7f6]" />
            SDG 14: Life Below Water Target 14.1 & 14.2
          </span>
          <h2 className="max-w-[448px] text-[32px] font-bold leading-10 tracking-[-0.64px] text-white">
            Restorasi Ekosistem Pesisir & Laut Nusantara
          </h2>
          <p className="max-w-[448px] text-[13px] leading-[19px] text-[#d0ecff]">
            Pusat komando tata kelola data observasi maritim, pemantauan satelit pukat liar, dan rekam jejak aksi
            konservasi relawan se-Indonesia.
          </p>
        </div>
      </div>

      <div className="relative py-8">
        <div className="relative h-44 overflow-hidden rounded-xl shadow-lg">
          <Image src="/login/foto-laut.jpg" alt="Terumbu karang dan penyu di perairan" fill sizes="480px" loading="eager" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a3446] via-[rgba(10,52,70,0.4)] to-transparent" />
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold leading-4 text-[#c4e7ff]">Zona Suaka Alam Laut Misool</p>
              <p className="text-xs leading-4 text-[#d0ecff]">Telemetri sensor perairan realtime & patroli drone laut</p>
            </div>
            <Image src="/login/ikon-sinyal.svg" alt="" width={16.667} height={11.792} />
          </div>
        </div>
      </div>

      <div className="relative flex gap-3 border-t border-white/10 pt-[17px]">
        {STATISTIK.map((s) => (
          <div key={s.nilai} className="flex flex-1 flex-col gap-1 rounded-xl bg-white/5 p-3 backdrop-blur-[8px]">
            <span className="flex items-center gap-1.5">
              <Image src={s.ikon} alt="" width={s.rw} height={s.rh} style={{ width: s.w, height: s.h }} />
              <span className={`text-lg font-bold leading-6 ${s.warna}`}>{s.nilai}</span>
            </span>
            <span className="text-[11px] font-medium leading-[13.75px] text-[#d0ecff]">{s.label}</span>
          </div>
        ))}
      </div>

      <p className="relative flex gap-3 pt-10 text-xs italic leading-4 text-[#dcf1ff]">
        <Image src="/login/ikon-kutip.svg" alt="" width={85} height={72} style={{ width: 14.167, height: 12 }} className="mt-0.5 shrink-0 self-start" />
        &ldquo;Menjaga integritas data kelautan adalah wujud kedaulatan masa depan perairan maritim nusantara.&rdquo;
      </p>
    </section>
  );
}
