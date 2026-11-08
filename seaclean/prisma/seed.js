// akun admin awal (npx prisma db seed)

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function showDatabaseSetupHint() {
  console.error("\nDatabase belum bisa diakses.");
  console.error("1. Salin .env.example ke .env jika belum ada.");
  console.error("2. Isi DATABASE_URL dan DIRECT_URL dengan connection string Supabase yang benar.");
  console.error("3. Untuk Supabase, DATABASE_URL biasanya pakai transaction pooler: port 6543 dan tambahkan ?pgbouncer=true");
  console.error("4. DIRECT_URL biasanya pakai session pooler: port 5432 untuk migrasi.");
}

async function ensureAdminRole() {
  const existingRole = await prisma.role.findUnique({ where: { kode: "ADMIN" } });

  if (existingRole) return existingRole;

  return prisma.role.create({
    data: {
      kode: "ADMIN",
      nama: "Admin",
      deskripsi: "Pengelola utama sistem",
    },
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi URL PostgreSQL Anda.");
  }

  const email = (process.env.ADMIN_EMAIL || "admin@seaclean.id").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  const role = await ensureAdminRole();

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      nama: "Admin LautKita",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      roleId: role.id,
    },
  });

  console.log(`Admin siap: ${email}`);
}

main()
  .catch((error) => {
    const message = String(error?.message || error || "");

    if (
      /Can't reach database server|ECONNREFUSED|database server|DATABASE_URL belum diisi|DIRECT_URL/.test(message)
    ) {
      showDatabaseSetupHint();
      if (message && !/DATABASE_URL belum diisi/.test(message)) {
        console.error(`\nDetail: ${message}`);
      }
    } else {
      console.error(error);
    }

    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
