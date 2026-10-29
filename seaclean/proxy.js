import { withAuth } from "next-auth/middleware";

// Halaman /admin hanya untuk Admin, halaman lain di matcher cukup login.
// Ini hanya untuk redirect halaman; setiap Server Action tetap cek role sendiri.
export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      if (req.nextUrl.pathname.startsWith("/admin")) return token.role === "ADMIN";
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/timeline/:path*"],
};
