-- CreateEnum
CREATE TYPE "StatusProgram" AS ENUM ('DRAF', 'SEGERA_HADIR', 'DIBUKA', 'BERJALAN', 'SELESAI');

-- CreateEnum
CREATE TYPE "FrekuensiMonitoring" AS ENUM ('MINGGUAN', 'DUA_MINGGUAN', 'BULANAN');

-- CreateTable
CREATE TABLE "program" (
    "id_program" SERIAL NOT NULL,
    "nama_program" TEXT NOT NULL,
    "penyelenggara" TEXT NOT NULL,
    "jenis_budidaya" "Ekosistem" NOT NULL,
    "id_lokasi" INTEGER NOT NULL,
    "id_spesies" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "batas_pendaftaran" DATE NOT NULL,
    "waktu_penanaman" TEXT NOT NULL,
    "kuota_peserta" INTEGER NOT NULL,
    "target_bibit" INTEGER NOT NULL,
    "pendamping" TEXT NOT NULL,
    "monitoring" "FrekuensiMonitoring" NOT NULL DEFAULT 'DUA_MINGGUAN',
    "persyaratan" TEXT NOT NULL,
    "status" "StatusProgram" NOT NULL DEFAULT 'DRAF',
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "program_pkey" PRIMARY KEY ("id_program")
);

-- CreateIndex
CREATE INDEX "program_id_lokasi_idx" ON "program"("id_lokasi");

-- CreateIndex
CREATE INDEX "program_id_spesies_idx" ON "program"("id_spesies");

-- CreateIndex
CREATE INDEX "program_status_idx" ON "program"("status");

-- AddForeignKey
ALTER TABLE "program" ADD CONSTRAINT "program_id_lokasi_fkey" FOREIGN KEY ("id_lokasi") REFERENCES "lokasi_budidaya"("id_lokasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program" ADD CONSTRAINT "program_id_spesies_fkey" FOREIGN KEY ("id_spesies") REFERENCES "spesies"("id_spesies") ON DELETE RESTRICT ON UPDATE CASCADE;

