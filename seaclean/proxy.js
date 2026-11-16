import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { bolehAkses } from "./lib/akses";

// Semua halaman di matcher wajib login. Halaman /admin dicek lagi dengan hak akses role (PBI-01):
// user yang sudah login tapi tidak berhak diarahkan ke /akses-ditolak, bukan ke halaman login.
// Ini hanya untuk halaman; setiap Server Action tetap cek hak akses sendiri ke database.
export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    if (pathname.startsWith("/admin") && !bolehAkses(token.role, token.akses, pathname)) {
      const url = new URL("/akses-ditolak", req.url);
      url.searchParams.set("dari", pathname);
      return NextResponse.redirect(url);
    }
  },
  {
    pages: { signIn: "/login" },
    callbacks: { authorized: ({ token }) => Boolean(token) },
  }
);

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
