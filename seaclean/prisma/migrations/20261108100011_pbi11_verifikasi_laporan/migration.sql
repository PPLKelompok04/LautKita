-- CreateEnum
CREATE TYPE "KeputusanVerifikasi" AS ENUM ('VALID', 'DITOLAK');

-- CreateTable
CREATE TABLE "verifikasi_laporan" (
    "id_verifikasi" SERIAL NOT NULL,
    "id_laporan" INTEGER NOT NULL,
    "id_verifikator" INTEGER NOT NULL,
    "keputusan" "KeputusanVerifikasi" NOT NULL,
    "catatan_verifikator" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifikasi_laporan_pkey" PRIMARY KEY ("id_verifikasi")
);

-- CreateIndex
CREATE UNIQUE INDEX "verifikasi_laporan_id_laporan_key" ON "verifikasi_laporan"("id_laporan");

-- CreateIndex
CREATE INDEX "verifikasi_laporan_id_verifikator_idx" ON "verifikasi_laporan"("id_verifikator");

-- AddForeignKey
ALTER TABLE "verifikasi_laporan" ADD CONSTRAINT "verifikasi_laporan_id_laporan_fkey" FOREIGN KEY ("id_laporan") REFERENCES "laporan_pencemaran"("id_laporan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifikasi_laporan" ADD CONSTRAINT "verifikasi_laporan_id_verifikator_fkey" FOREIGN KEY ("id_verifikator") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

