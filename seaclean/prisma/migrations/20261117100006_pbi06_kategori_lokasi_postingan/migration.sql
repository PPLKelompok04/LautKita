-- PBI-06: kategori postingan dan tag lokasi
-- CreateEnum
CREATE TYPE "KategoriPostingan" AS ENUM ('UMUM', 'BUDIDAYA', 'PENCEMARAN', 'EDUKASI', 'KEGIATAN');

-- AlterTable
ALTER TABLE "postingan" ADD COLUMN "kategori" "KategoriPostingan" NOT NULL DEFAULT 'UMUM',
ADD COLUMN "id_wilayah" INTEGER;

-- CreateIndex
CREATE INDEX "postingan_kategori_idx" ON "postingan"("kategori");

-- CreateIndex
CREATE INDEX "postingan_id_wilayah_idx" ON "postingan"("id_wilayah");

-- AddForeignKey
ALTER TABLE "postingan" ADD CONSTRAINT "postingan_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "wilayah"("id_wilayah") ON DELETE SET NULL ON UPDATE CASCADE;
