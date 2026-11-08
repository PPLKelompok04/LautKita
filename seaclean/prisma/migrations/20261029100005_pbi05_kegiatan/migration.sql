-- CreateEnum
CREATE TYPE "JenisKegiatan" AS ENUM ('BERSIH_PANTAI', 'TANAM_MANGROVE', 'TRANSPLANTASI_KARANG', 'EDUKASI', 'LAINNYA');

-- CreateEnum
CREATE TYPE "StatusKegiatan" AS ENUM ('DIBUKA', 'PENUH', 'DITUTUP', 'SELESAI', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "kegiatan" (
    "id_kegiatan" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "jenis" "JenisKegiatan" NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "id_wilayah" INTEGER,
    "lokasi_teks" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "kuota" INTEGER NOT NULL,
    "status" "StatusKegiatan" NOT NULL DEFAULT 'DIBUKA',
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kegiatan_pkey" PRIMARY KEY ("id_kegiatan")
);

-- CreateIndex
CREATE INDEX "kegiatan_tanggal_mulai_idx" ON "kegiatan"("tanggal_mulai");

-- CreateIndex
CREATE INDEX "kegiatan_status_idx" ON "kegiatan"("status");

-- CreateIndex
CREATE INDEX "kegiatan_id_wilayah_idx" ON "kegiatan"("id_wilayah");

-- AddForeignKey
ALTER TABLE "kegiatan" ADD CONSTRAINT "kegiatan_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah"("id_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;

