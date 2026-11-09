// akun admin awal + relawan dummy + dummy postingan (npx prisma db seed)

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

async function ensureRole(kode, nama, deskripsi) {
  return prisma.role.upsert({
    where: { kode },
    update: {},
    create: { kode, nama, deskripsi },
  });
}

const RELAWAN = [
  { key: "jeonghan", nama: "Yoon Jeonghan", email: "yoon.jeonghan@seaclean.id" },
  { key: "mingyu", nama: "Kim Mingyu", email: "kim.mingyu@seaclean.id" },
  { key: "naravit", nama: "Naravit", email: "naravit@seaclean.id" },
  { key: "jisoo", nama: "Hong Jisoo", email: "hong.jisoo@seaclean.id" },
  { key: "phuwintang", nama: "Phuwintang", email: "phuwintang@seaclean.id" },
];

async function seedRelawan() {
  const role = await ensureRole("RELAWAN", "Relawan", "Anggota komunitas / relawan");
  const passwordHash = await bcrypt.hash("relawan12345", 10);
  const map = {};

  for (const r of RELAWAN) {
    const user = await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: { nama: r.nama, email: r.email, passwordHash, roleId: role.id },
    });
    map[r.key] = user.id;
  }

  console.log(`${RELAWAN.length} relawan dummy siap.`);
  return map;
}

async function seedDummyPostingan(adminId, relawan) {
  // bersihkan dummy lama yang ditulis admin (seed versi sebelumnya)
  await prisma.postingan.deleteMany({ where: { penulisId: adminId } });

  const existing = await prisma.postingan.count({
    where: { penulisId: { in: Object.values(relawan) } },
  });
  if (existing > 0) {
    console.log(`Postingan relawan sudah ada (${existing}), dummy dilewati.`);
    return;
  }

  const hoursAgo = (n) => new Date(Date.now() - n * 60 * 60 * 1000);

  const data = [
    {
      penulis: "jeonghan",
      isi: "INVESTASI BUDIDAYA LOBSTER! Modal 500rb balik 5 juta dalam 3 hari, dijamin tanpa rugi. Transfer ke rek 1234567890 a.n. Budi, kirim bukti ke WA 08123456789. Slot terbatas!!",
      status: "TAMPIL",
      tags: ["penipuan", "investasi"],
      createdAt: hoursAgo(5),
    },
    {
      penulis: "mingyu",
      isi: "Nelayan pendatang dari luar pulau itu kotor dan biang masalah, usir saja dari kampung kita. Jangan kasih mereka izin melaut di sini!",
      status: "TAMPIL",
      tags: ["sara", "nelayan"],
      createdAt: hoursAgo(20),
    },
    {
      penulis: "naravit",
      isi: "Klik link ini untuk klaim bantuan bibit gratis dari pemerintah, isi data KTP dan PIN ATM kamu: bit.ly/bantuan-bibit-gratis (berlaku sampai hari ini saja)",
      status: "DISEMBUNYIKAN",
      tags: ["phishing", "bantuan"],
      createdAt: hoursAgo(50),
      peringatan: "Postingan Anda disembunyikan karena terindikasi penipuan (phishing). Mohon tidak membagikan tautan yang meminta data pribadi.",
    },
    {
      penulis: "jisoo",
      isi: "Pak Haji Ahmad itu penipu dan maling, ayo kita ramai-ramai datangi rumahnya malam ini dan beri pelajaran!",
      status: "TAMPIL",
      tags: ["provokasi", "ujarankebencian"],
      createdAt: hoursAgo(30),
    },
    {
      penulis: "phuwintang",
      isi: "Jual potas ikan, sekali tebar hasil tangkapan melimpah. Murah, COD sekitar pesisir. Chat aja, no ribet izin-izin.",
      status: "TAMPIL",
      tags: ["ilegal", "potas"],
      createdAt: hoursAgo(80),
    },
    {
      penulis: "jisoo",
      isi: "HATI-HATI! Air laut di zona B sudah beracun semua, ikan yang dipanen bikin orang mati. Jangan beli hasil panen dari petani sini!",
      status: "DISEMBUNYIKAN",
      tags: ["hoaks", "zonab"],
      createdAt: hoursAgo(120),
      peringatan: "Postingan Anda disembunyikan karena berisi informasi yang belum terverifikasi (hoaks) dan merugikan pembudidaya.",
    },
    {
      penulis: "mingyu",
      isi: "Follow IG @promo_laut_murah dapat voucher 100rb, wajib share ke 20 grup biar cair! Cek bio.",
      status: "TAMPIL",
      tags: ["spam"],
      createdAt: hoursAgo(200),
      peringatan: "Postingan Anda mengandung spam. Mohon tidak membagikan konten promosi yang tidak relevan.",
    },
  ];

  for (const item of data) {
    await prisma.postingan.create({
      data: {
        penulisId: relawan[item.penulis],
        isi: item.isi,
        status: item.status,
        createdAt: item.createdAt,
        tag: {
          create: item.tags.map((nama) => ({
            tag: {
              connectOrCreate: { where: { nama }, create: { nama } },
            },
          })),
        },
        ...(item.peringatan
          ? { peringatan: { create: [{ adminId, pesan: item.peringatan }] } }
          : {}),
      },
    });
  }

  console.log(`${data.length} dummy postingan berhasil ditambahkan.`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi URL PostgreSQL Anda.");
  }

  const email = (process.env.ADMIN_EMAIL || "admin@seaclean.id").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin12345";

  const adminRole = await ensureRole("ADMIN", "Admin", "Pengelola utama sistem");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      nama: "Admin LautKita",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      roleId: adminRole.id,
    },
  });

  console.log(`Admin siap: ${email}`);

  const relawan = await seedRelawan();
  await seedDummyPostingan(admin.id, relawan);
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