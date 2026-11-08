-- CreateTable
CREATE TABLE "roles" (
    "id_role" SERIAL NOT NULL,
    "kode_role" TEXT NOT NULL,
    "nama_role" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "no_telepon" TEXT,
    "foto_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "id_role" INTEGER NOT NULL,
    "id_wilayah" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_kode_role_key" ON "roles"("kode_role");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nama_role_key" ON "roles"("nama_role");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_role_idx" ON "users"("id_role");

-- CreateIndex
CREATE INDEX "users_id_wilayah_idx" ON "users"("id_wilayah");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah"("id_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;


-- Data awal: tiga peran pengguna sesuai proposal
INSERT INTO "roles" ("kode_role", "nama_role", "deskripsi") VALUES
    ('ADMIN', 'Admin', 'Pengelola utama sistem'),
    ('PETUGAS', 'Petugas Lapangan', 'Memverifikasi laporan dan mencatat tindak lanjut'),
    ('RELAWAN', 'Relawan', 'Melapor, mengikuti program dan kegiatan, berinteraksi di timeline');
