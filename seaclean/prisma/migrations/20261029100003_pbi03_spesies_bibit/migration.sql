-- CreateEnum
CREATE TYPE "StatusKonservasi" AS ENUM ('LC', 'VU', 'EN', 'CR');

-- CreateTable
CREATE TABLE "spesies" (
    "id_spesies" SERIAL NOT NULL,
    "nama_lokal" TEXT NOT NULL,
    "nama_ilmiah" TEXT,
    "golongan" "Ekosistem" NOT NULL,
    "status_konservasi" "StatusKonservasi" NOT NULL DEFAULT 'LC',
    "deskripsi" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "umur_bibit" TEXT,
    "substrat" TEXT,
    "salinitas" TEXT,
    "kondisi_perairan" TEXT,
    "cara_menanam" TEXT,
    "foto_url" TEXT,
    "dokumen_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spesies_pkey" PRIMARY KEY ("id_spesies")
);

-- CreateTable
CREATE TABLE "bibit" (
    "id_bibit" SERIAL NOT NULL,
    "id_spesies" INTEGER NOT NULL,
    "nama_bibit" TEXT NOT NULL,
    "sumber" TEXT,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "satuan" TEXT NOT NULL DEFAULT 'bibit',
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bibit_pkey" PRIMARY KEY ("id_bibit")
);

-- CreateIndex
CREATE UNIQUE INDEX "spesies_nama_ilmiah_key" ON "spesies"("nama_ilmiah");

-- CreateIndex
CREATE INDEX "spesies_golongan_idx" ON "spesies"("golongan");

-- CreateIndex
CREATE INDEX "bibit_id_spesies_idx" ON "bibit"("id_spesies");

-- AddForeignKey
ALTER TABLE "bibit" ADD CONSTRAINT "bibit_id_spesies_fkey" FOREIGN KEY ("id_spesies") REFERENCES "spesies"("id_spesies") ON DELETE CASCADE ON UPDATE CASCADE;

