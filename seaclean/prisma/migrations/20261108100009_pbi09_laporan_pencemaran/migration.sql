-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('MENUNGGU', 'VALID', 'DITOLAK', 'DITINDAKLANJUTI', 'SELESAI');

-- CreateTable
CREATE TABLE "laporan_pencemaran" (
    "id_laporan" SERIAL NOT NULL,
    "id_pelapor" INTEGER NOT NULL,
    "is_anonim" BOOLEAN NOT NULL DEFAULT false,
    "id_kategori" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "lokasi_teks" TEXT,
    "foto_url" TEXT,
    "status" "StatusLaporan" NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laporan_pencemaran_pkey" PRIMARY KEY ("id_laporan")
);

-- CreateIndex
CREATE INDEX "laporan_pencemaran_status_idx" ON "laporan_pencemaran"("status");

-- CreateIndex
CREATE INDEX "laporan_pencemaran_id_pelapor_idx" ON "laporan_pencemaran"("id_pelapor");

-- CreateIndex
CREATE INDEX "laporan_pencemaran_id_kategori_idx" ON "laporan_pencemaran"("id_kategori");

-- AddForeignKey
ALTER TABLE "laporan_pencemaran" ADD CONSTRAINT "laporan_pencemaran_id_pelapor_fkey" FOREIGN KEY ("id_pelapor") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_pencemaran" ADD CONSTRAINT "laporan_pencemaran_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "kategori_pencemaran"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

