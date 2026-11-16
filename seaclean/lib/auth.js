import { getServerSession } from "next-auth";
import { connection } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { bolehAkses, daftarAkses } from "@/lib/akses";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
          include: { role: true },
        });
        if (!user || !user.aktif) return null;

        const cocok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!cocok) return null;

        return {
          id: String(user.id),
          name: user.nama,
          email: user.email,
          image: user.fotoUrl,
          role: user.role.kode,
          akses: user.role.akses,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.role = user.role;
        // daftar halaman admin yang boleh dibuka; perubahan hak akses berlaku setelah login ulang
        token.akses = user.akses;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.akses = daftarAkses(token.role, token.akses);
      return session;
    },
  },
};

// connection() dulu: session harus dibaca per request. Tanpa ini, cacheComponents
// mencoba prerender dan gagal karena NextAuth memakai crypto.randomBytes.
export async function getSession() {
  await connection();
  return getServerSession(authOptions);
}

// Dipanggil di awal setiap Server Action / API yang mengubah data.
// Role dicek ulang ke database supaya user yang dinonaktifkan atau
// diganti role-nya langsung kehilangan akses.
export async function requireRole(...roles) {
  const session = await getSession();
  if (!session?.user?.id) throw new Error("Silakan login terlebih dahulu");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });
  if (!user || !user.aktif) throw new Error("Akun tidak aktif");
  if (roles.length && !roles.includes(user.role.kode)) {
    throw new Error("Anda tidak punya akses untuk aksi ini");
  }
  return user;
}

// Untuk Server Action di halaman admin: boleh kalau ADMIN atau role-nya diberi akses ke `halaman`
// (diatur di menu Role & hak akses). Dicek ke database, jadi perubahan hak akses langsung berlaku.
export async function requireAkses(halaman) {
  const user = await requireRole();
  if (!bolehAkses(user.role.kode, user.role.akses, halaman)) {
    throw new Error("Anda tidak punya akses untuk aksi ini");
  }
  return user;
}
