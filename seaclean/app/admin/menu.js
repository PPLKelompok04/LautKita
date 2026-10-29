import {
  CalendarDays,
  Database,
  FlaskConical,
  LayoutDashboard,
  MapPinned,
  MessagesSquare,
  ShieldCheck,
  Sprout,
  TriangleAlert,
  Users,
  Waves,
} from "lucide-react";

// Menu admin. Tiap PBI CRUD punya satu baris di sini.
export const MENU = [
  {
    grup: "Menu utama",
    item: [{ href: "/admin", label: "Ringkasan", ikon: LayoutDashboard }],
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
];

// Cari item menu untuk path tertentu (dipakai untuk menu aktif & breadcrumb)
export function menuAktif(pathname) {
  const semua = MENU.flatMap((g) => g.item.map((i) => ({ ...i, grup: g.grup })));
  return semua.filter((i) => i.href !== "/admin").find((i) => pathname.startsWith(i.href)) ??
    semua.find((i) => i.href === pathname);
}
