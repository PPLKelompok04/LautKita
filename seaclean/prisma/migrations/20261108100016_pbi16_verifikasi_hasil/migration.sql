-- CreateEnum
CREATE TYPE "KeputusanHasil" AS ENUM ('DITERIMA', 'DITOLAK', 'REVISI');

-- CreateTable
CREATE TABLE "verifikasi_hasil" (
    "id_verifikasi_hasil" SERIAL NOT NULL,
    "id_monitoring" INTEGER NOT NULL,
    "id_verifikator" INTEGER NOT NULL,
    "keputusan" "KeputusanHasil" NOT NULL,
    "catatan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifikasi_hasil_pkey" PRIMARY KEY ("id_verifikasi_hasil")
);

-- CreateIndex
CREATE INDEX "verifikasi_hasil_id_monitoring_idx" ON "verifikasi_hasil"("id_monitoring");

-- CreateIndex
CREATE INDEX "verifikasi_hasil_id_verifikator_idx" ON "verifikasi_hasil"("id_verifikator");

-- AddForeignKey
ALTER TABLE "verifikasi_hasil" ADD CONSTRAINT "verifikasi_hasil_id_monitoring_fkey" FOREIGN KEY ("id_monitoring") REFERENCES "monitoring_budidaya"("id_monitoring") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifikasi_hasil" ADD CONSTRAINT "verifikasi_hasil_id_verifikator_fkey" FOREIGN KEY ("id_verifikator") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

