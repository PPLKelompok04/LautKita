-- CreateEnum
CREATE TYPE "Ekosistem" AS ENUM ('KARANG', 'IKAN', 'MANGROVE');

-- CreateTable
CREATE TABLE "lokasi_budidaya" (
    "id_lokasi" SERIAL NOT NULL,
    "nama_lokasi" TEXT NOT NULL,
    "jenis_budidaya" "Ekosistem" NOT NULL,
    "id_wilayah" INTEGER,
    "deskripsi" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "foto_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lokasi_budidaya_pkey" PRIMARY KEY ("id_lokasi")
);

-- CreateTable
CREATE TABLE "zona" (
    "id_zona" SERIAL NOT NULL,
    "id_lokasi" INTEGER NOT NULL,
    "nama_zona" TEXT NOT NULL,
    "luas_m2" DOUBLE PRECISION,
    "keterangan" TEXT,

    CONSTRAINT "zona_pkey" PRIMARY KEY ("id_zona")
);

-- CreateIndex
CREATE INDEX "lokasi_budidaya_jenis_budidaya_idx" ON "lokasi_budidaya"("jenis_budidaya");

-- CreateIndex
CREATE INDEX "lokasi_budidaya_id_wilayah_idx" ON "lokasi_budidaya"("id_wilayah");

-- CreateIndex
CREATE INDEX "zona_id_lokasi_idx" ON "zona"("id_lokasi");

-- AddForeignKey
ALTER TABLE "lokasi_budidaya" ADD CONSTRAINT "lokasi_budidaya_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah"("id_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zona" ADD CONSTRAINT "zona_id_lokasi_fkey" FOREIGN KEY ("id_lokasi") REFERENCES "lokasi_budidaya"("id_lokasi") ON DELETE CASCADE ON UPDATE CASCADE;

