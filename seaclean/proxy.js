import { withAuth } from "next-auth/middleware";

// Halaman verifikasi juga boleh dibuka Petugas lapangan
const HALAMAN_PETUGAS = ["/admin/verifikasi-laporan", "/admin/tindak-lanjut", "/admin/verifikasi-hasil"];

// Halaman /admin hanya untuk Admin, halaman lain di matcher cukup login.
// Ini hanya untuk redirect halaman; setiap Server Action tetap cek role sendiri.
export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      const path = req.nextUrl.pathname;
      if (!path.startsWith("/admin") || token.role === "ADMIN") return true;
      return token.role === "PETUGAS" && (path === "/admin" || HALAMAN_PETUGAS.some((h) => path.startsWith(h)));
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/timeline/:path*",
    "/postingan/:path*",
    "/lapor/:path*",
    "/kegiatan/:path*",
    "/program/:path*",
    "/monitoring/:path*",
    "/notifikasi/:path*",
  ],
};
