-- CreateEnum
CREATE TYPE "StatusPostingan" AS ENUM ('TAMPIL', 'DISEMBUNYIKAN');

-- CreateTable
CREATE TABLE "postingan" (
    "id_postingan" SERIAL NOT NULL,
    "id_penulis" INTEGER NOT NULL,
    "isi" TEXT NOT NULL,
    "gambar_url" TEXT,
    "status_publikasi" "StatusPostingan" NOT NULL DEFAULT 'TAMPIL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postingan_pkey" PRIMARY KEY ("id_postingan")
);

-- CreateTable
CREATE TABLE "tag" (
    "id_tag" SERIAL NOT NULL,
    "nama_tag" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id_tag")
);

-- CreateTable
CREATE TABLE "postingan_tag" (
    "id_postingan" INTEGER NOT NULL,
    "id_tag" INTEGER NOT NULL,

    CONSTRAINT "postingan_tag_pkey" PRIMARY KEY ("id_postingan","id_tag")
);

-- CreateIndex
CREATE INDEX "postingan_id_penulis_idx" ON "postingan"("id_penulis");

-- CreateIndex
CREATE INDEX "postingan_created_at_idx" ON "postingan"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tag_nama_tag_key" ON "tag"("nama_tag");

-- CreateIndex
CREATE INDEX "postingan_tag_id_tag_idx" ON "postingan_tag"("id_tag");

-- AddForeignKey
ALTER TABLE "postingan" ADD CONSTRAINT "postingan_id_penulis_fkey" FOREIGN KEY ("id_penulis") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postingan_tag" ADD CONSTRAINT "postingan_tag_id_postingan_fkey" FOREIGN KEY ("id_postingan") REFERENCES "postingan"("id_postingan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postingan_tag" ADD CONSTRAINT "postingan_tag_id_tag_fkey" FOREIGN KEY ("id_tag") REFERENCES "tag"("id_tag") ON DELETE CASCADE ON UPDATE CASCADE;

