// Hak akses halaman admin (PBI-01). Dipakai proxy.js, menu, dan Server Action.
// Tidak boleh import prisma di sini karena ikut dijalankan di proxy.

// Hak akses bawaan Petugas, dipakai kalau token login lama belum membawa daftar akses
const AKSES_PETUGAS = ["/admin/verifikasi-laporan", "/admin/tindak-lanjut", "/admin/verifikasi-hasil"];

// Halaman yang tidak bisa diberikan ke role selain ADMIN (supaya role lain tidak bisa menaikkan aksesnya sendiri)
export const HANYA_ADMIN = ["/admin/user", "/admin/role"];

export function daftarAkses(role, akses) {
  return akses ?? (role === "PETUGAS" ? AKSES_PETUGAS : []);
}

// true kalau `role` dengan daftar `akses` boleh membuka `path`
export function bolehAkses(role, akses, path) {
  if (role === "ADMIN") return true;
  const daftar = daftarAkses(role, akses);
  // halaman ringkasan /admin bisa dibuka siapa pun yang punya minimal satu akses
  if (path === "/admin") return daftar.length > 0;
  return daftar.some((h) => !HANYA_ADMIN.includes(h) && (path === h || path.startsWith(`${h}/`)));
}
