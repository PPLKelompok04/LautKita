-- CreateEnum
CREATE TYPE "TingkatKerawanan" AS ENUM ('RENDAH', 'SEDANG', 'TINGGI');

-- CreateTable
CREATE TABLE "rawan_abrasi" (
    "id_abrasi" SERIAL NOT NULL,
    "nama_titik" TEXT NOT NULL,
    "id_wilayah" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "tingkat_kerawanan" "TingkatKerawanan" NOT NULL,
    "panjang_garis_pantai_m" DOUBLE PRECISION,
    "laju_abrasi_m_per_tahun" DOUBLE PRECISION,
    "tanggal_pendataan" DATE NOT NULL,
    "keterangan" TEXT,
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rawan_abrasi_pkey" PRIMARY KEY ("id_abrasi")
);

-- CreateIndex
CREATE INDEX "rawan_abrasi_tingkat_kerawanan_idx" ON "rawan_abrasi"("tingkat_kerawanan");

-- CreateIndex
CREATE INDEX "rawan_abrasi_id_wilayah_idx" ON "rawan_abrasi"("id_wilayah");

-- AddForeignKey
ALTER TABLE "rawan_abrasi" ADD CONSTRAINT "rawan_abrasi_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah"("id_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;

