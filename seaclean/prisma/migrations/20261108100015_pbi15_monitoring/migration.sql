-- CreateEnum
CREATE TYPE "JenisMonitoring" AS ENUM ('PENANAMAN', 'TRANSPLANTASI', 'PEMANTAUAN');

-- CreateEnum
CREATE TYPE "StatusMonitoring" AS ENUM ('MENUNGGU', 'DITERIMA', 'DITOLAK', 'REVISI');

-- CreateTable
CREATE TABLE "monitoring_budidaya" (
    "id_monitoring" SERIAL NOT NULL,
    "id_program" INTEGER NOT NULL,
    "id_pencatat" INTEGER NOT NULL,
    "jenis" "JenisMonitoring" NOT NULL,
    "tanggal_catat" DATE NOT NULL,
    "jumlah_ditanam" INTEGER NOT NULL,
    "jumlah_hidup" INTEGER NOT NULL,
    "catatan" TEXT,
    "foto_url" TEXT,
    "status" "StatusMonitoring" NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitoring_budidaya_pkey" PRIMARY KEY ("id_monitoring")
);

-- CreateIndex
CREATE INDEX "monitoring_budidaya_id_program_idx" ON "monitoring_budidaya"("id_program");

-- CreateIndex
CREATE INDEX "monitoring_budidaya_id_pencatat_idx" ON "monitoring_budidaya"("id_pencatat");

-- CreateIndex
CREATE INDEX "monitoring_budidaya_status_idx" ON "monitoring_budidaya"("status");

-- AddForeignKey
ALTER TABLE "monitoring_budidaya" ADD CONSTRAINT "monitoring_budidaya_id_program_fkey" FOREIGN KEY ("id_program") REFERENCES "program"("id_program") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitoring_budidaya" ADD CONSTRAINT "monitoring_budidaya_id_pencatat_fkey" FOREIGN KEY ("id_pencatat") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

