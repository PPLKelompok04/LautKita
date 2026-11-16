import {
  Activity,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Database,
  FileWarning,
  FlaskConical,
  LayoutDashboard,
  MapPinned,
  MessagesSquare,
  ShieldCheck,
  Sprout,
  TriangleAlert,
  UserCheck,
  UserPlus,
  Users,
  Waves,
  Wrench,
} from "lucide-react";

import { HANYA_ADMIN, bolehAkses } from "@/lib/akses";

// Menu admin. Tiap PBI punya satu baris di sini.
// Siapa yang boleh membuka diatur per role di menu "Role & hak akses" (PBI-01); ADMIN selalu boleh semua.
export const MENU = [
  {
    grup: "Menu utama",
    item: [{ href: "/admin", label: "Ringkasan", ikon: LayoutDashboard }],
  },
  {
    grup: "Pengguna",
    item: [
      { href: "/admin/user", label: "Manajemen pengguna", ikon: Users },
      { href: "/admin/role", label: "Role & hak akses", ikon: ShieldCheck },
    ],
  },
  {
    grup: "Data master",
    item: [
      { href: "/admin/wilayah", label: "Wilayah", ikon: MapPinned },
      { href: "/admin/lokasi", label: "Lokasi budidaya & zona", ikon: Database },
      { href: "/admin/spesies", label: "Spesies & bibit", ikon: FlaskConical },
      { href: "/admin/kategori-pencemaran", label: "Kategori pencemaran", ikon: TriangleAlert },
      { href: "/admin/rawan-abrasi", label: "Lokasi rawan abrasi", ikon: Waves },
    ],
  },
  {
    grup: "Program & kegiatan",
    item: [
      { href: "/admin/program", label: "Program budidaya", ikon: Sprout },
      { href: "/admin/kegiatan", label: "Kegiatan komunitas", ikon: CalendarDays },
    ],
  },
  {
    grup: "Komunitas",
    item: [{ href: "/admin/postingan", label: "Moderasi postingan", ikon: MessagesSquare }],
  },
  {
    grup: "Laporan pencemaran",
    item: [
      { href: "/admin/laporan", label: "Laporan masuk", ikon: FileWarning },
      { href: "/admin/verifikasi-laporan", label: "Verifikasi laporan", ikon: ClipboardCheck },
      { href: "/admin/tindak-lanjut", label: "Tindak lanjut", ikon: Wrench },
    ],
  },
  {
    grup: "Partisipasi",
    item: [
      { href: "/admin/peserta-kegiatan", label: "Peserta kegiatan", ikon: UserPlus },
      { href: "/admin/partisipasi-program", label: "Peserta program", ikon: UserCheck },
      { href: "/admin/monitoring", label: "Monitoring budidaya", ikon: Activity },
      { href: "/admin/verifikasi-hasil", label: "Verifikasi hasil", ikon: BadgeCheck },
    ],
  },
];

export function bolehBuka(item, role, akses) {
  return bolehAkses(role, akses, item.href);
}

// menu yang boleh dilihat role tertentu
export function menuUntuk(role, akses) {
  return MENU.map((g) => ({ ...g, item: g.item.filter((i) => bolehBuka(i, role, akses)) })).filter((g) => g.item.length);
}

// Halaman yang bisa dicentang di form role (selain Ringkasan dan halaman khusus ADMIN)
export const HALAMAN_AKSES = MENU.flatMap((g) => g.item.map((i) => ({ href: i.href, label: i.label, grup: g.grup }))).filter(
  (i) => i.href !== "/admin" && !HANYA_ADMIN.includes(i.href)
);

// Cari item menu untuk path tertentu (dipakai untuk menu aktif & breadcrumb)
export function menuAktif(pathname) {
  const semua = MENU.flatMap((g) => g.item.map((i) => ({ ...i, grup: g.grup })));
  return semua.filter((i) => i.href !== "/admin").find((i) => pathname.startsWith(i.href)) ??
    semua.find((i) => i.href === pathname);
}
