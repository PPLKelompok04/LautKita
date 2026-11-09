-- CreateEnum
CREATE TYPE "StatusKehadiran" AS ENUM ('BELUM', 'HADIR', 'TIDAK_HADIR');

-- CreateTable
CREATE TABLE "pendaftaran_kegiatan" (
    "id_pendaftaran" SERIAL NOT NULL,
    "id_kegiatan" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "kehadiran" "StatusKehadiran" NOT NULL DEFAULT 'BELUM',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendaftaran_kegiatan_pkey" PRIMARY KEY ("id_pendaftaran")
);

-- CreateIndex
CREATE INDEX "pendaftaran_kegiatan_id_user_idx" ON "pendaftaran_kegiatan"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "pendaftaran_kegiatan_id_kegiatan_id_user_key" ON "pendaftaran_kegiatan"("id_kegiatan", "id_user");

-- AddForeignKey
ALTER TABLE "pendaftaran_kegiatan" ADD CONSTRAINT "pendaftaran_kegiatan_id_kegiatan_fkey" FOREIGN KEY ("id_kegiatan") REFERENCES "kegiatan"("id_kegiatan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendaftaran_kegiatan" ADD CONSTRAINT "pendaftaran_kegiatan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

