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

const SEMUA = ["ADMIN", "PETUGAS"];

// Menu admin. Tiap PBI punya satu baris di sini.
// `role` = siapa saja yang boleh buka, kalau tidak diisi hanya ADMIN.
export const MENU = [
  {
    grup: "Menu utama",
    item: [{ href: "/admin", label: "Ringkasan", ikon: LayoutDashboard, role: SEMUA }],
  },
  {
    grup: "Pengguna",
    item: [
      { href: "/admin/user", label: "Manajemen pengguna", ikon: Users, pbi: "PBI-01" },
      { href: "/admin/role", label: "Role & hak akses", ikon: ShieldCheck, pbi: "PBI-01" },
    ],
  },
  {
    grup: "Data master",
    item: [
      { href: "/admin/wilayah", label: "Wilayah", ikon: MapPinned, pbi: "Data bersama" },
      { href: "/admin/lokasi", label: "Lokasi budidaya & zona", ikon: Database, pbi: "PBI-02" },
      { href: "/admin/spesies", label: "Spesies & bibit", ikon: FlaskConical, pbi: "PBI-03" },
      { href: "/admin/kategori-pencemaran", label: "Kategori pencemaran", ikon: TriangleAlert, pbi: "PBI-07" },
      { href: "/admin/rawan-abrasi", label: "Lokasi rawan abrasi", ikon: Waves, pbi: "PBI-08" },
    ],
  },
  {
    grup: "Program & kegiatan",
    item: [
      { href: "/admin/program", label: "Program budidaya", ikon: Sprout, pbi: "PBI-04" },
      { href: "/admin/kegiatan", label: "Kegiatan komunitas", ikon: CalendarDays, pbi: "PBI-05" },
    ],
  },
  {
    grup: "Komunitas",
    item: [{ href: "/admin/postingan", label: "Moderasi postingan", ikon: MessagesSquare, pbi: "PBI-06" }],
  },
  {
    grup: "Laporan pencemaran",
    item: [
      { href: "/admin/laporan", label: "Laporan masuk", ikon: FileWarning, pbi: "PBI-09" },
      { href: "/admin/verifikasi-laporan", label: "Verifikasi laporan", ikon: ClipboardCheck, pbi: "PBI-11", role: SEMUA },
      { href: "/admin/tindak-lanjut", label: "Tindak lanjut", ikon: Wrench, pbi: "PBI-12", role: SEMUA },
    ],
  },
  {
    grup: "Partisipasi",
    item: [
      { href: "/admin/peserta-kegiatan", label: "Peserta kegiatan", ikon: UserPlus, pbi: "PBI-13" },
      { href: "/admin/partisipasi-program", label: "Peserta program", ikon: UserCheck, pbi: "PBI-14" },
      { href: "/admin/monitoring", label: "Monitoring budidaya", ikon: Activity, pbi: "PBI-15" },
      { href: "/admin/verifikasi-hasil", label: "Verifikasi hasil", ikon: BadgeCheck, pbi: "PBI-16", role: SEMUA },
    ],
  },
];

export function bolehBuka(item, role) {
  return (item.role ?? ["ADMIN"]).includes(role);
}

// menu yang boleh dilihat role tertentu
export function menuUntuk(role) {
  return MENU.map((g) => ({ ...g, item: g.item.filter((i) => bolehBuka(i, role)) })).filter((g) => g.item.length);
}

// Cari item menu untuk path tertentu (dipakai untuk menu aktif & breadcrumb)
export function menuAktif(pathname) {
  const semua = MENU.flatMap((g) => g.item.map((i) => ({ ...i, grup: g.grup })));
  return semua.filter((i) => i.href !== "/admin").find((i) => pathname.startsWith(i.href)) ??
    semua.find((i) => i.href === pathname);
}
