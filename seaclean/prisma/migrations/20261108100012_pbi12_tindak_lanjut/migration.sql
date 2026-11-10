-- CreateEnum
CREATE TYPE "StatusTindakLanjut" AS ENUM ('DITUGASKAN', 'SELESAI');

-- CreateTable
CREATE TABLE "tindak_lanjut" (
    "id_tindak_lanjut" SERIAL NOT NULL,
    "id_laporan" INTEGER NOT NULL,
    "id_petugas" INTEGER NOT NULL,
    "instruksi" TEXT,
    "status" "StatusTindakLanjut" NOT NULL DEFAULT 'DITUGASKAN',
    "catatan_penanganan" TEXT,
    "bukti_url" TEXT,
    "selesai_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tindak_lanjut_pkey" PRIMARY KEY ("id_tindak_lanjut")
);

-- CreateIndex
CREATE UNIQUE INDEX "tindak_lanjut_id_laporan_key" ON "tindak_lanjut"("id_laporan");

-- CreateIndex
CREATE INDEX "tindak_lanjut_id_petugas_idx" ON "tindak_lanjut"("id_petugas");

-- CreateIndex
CREATE INDEX "tindak_lanjut_status_idx" ON "tindak_lanjut"("status");

-- AddForeignKey
ALTER TABLE "tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_id_laporan_fkey" FOREIGN KEY ("id_laporan") REFERENCES "laporan_pencemaran"("id_laporan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_id_petugas_fkey" FOREIGN KEY ("id_petugas") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

