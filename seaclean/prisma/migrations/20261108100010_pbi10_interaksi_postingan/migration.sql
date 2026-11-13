-- CreateTable
CREATE TABLE "suka" (
    "id_postingan" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suka_pkey" PRIMARY KEY ("id_postingan","id_user")
);

-- CreateTable
CREATE TABLE "komentar" (
    "id_komentar" SERIAL NOT NULL,
    "id_postingan" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_parent" INTEGER,
    "isi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "komentar_pkey" PRIMARY KEY ("id_komentar")
);

-- CreateTable
CREATE TABLE "bagikan" (
    "id_bagikan" SERIAL NOT NULL,
    "id_postingan" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bagikan_pkey" PRIMARY KEY ("id_bagikan")
);

-- CreateIndex
CREATE INDEX "suka_id_user_idx" ON "suka"("id_user");

-- CreateIndex
CREATE INDEX "komentar_id_postingan_idx" ON "komentar"("id_postingan");

-- CreateIndex
CREATE INDEX "komentar_id_user_idx" ON "komentar"("id_user");

-- CreateIndex
CREATE INDEX "komentar_id_parent_idx" ON "komentar"("id_parent");

-- CreateIndex
CREATE INDEX "bagikan_id_postingan_idx" ON "bagikan"("id_postingan");

-- CreateIndex
CREATE INDEX "bagikan_id_user_idx" ON "bagikan"("id_user");

-- AddForeignKey
ALTER TABLE "suka" ADD CONSTRAINT "suka_id_postingan_fkey" FOREIGN KEY ("id_postingan") REFERENCES "postingan"("id_postingan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suka" ADD CONSTRAINT "suka_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_id_postingan_fkey" FOREIGN KEY ("id_postingan") REFERENCES "postingan"("id_postingan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "komentar" ADD CONSTRAINT "komentar_id_parent_fkey" FOREIGN KEY ("id_parent") REFERENCES "komentar"("id_komentar") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagikan" ADD CONSTRAINT "bagikan_id_postingan_fkey" FOREIGN KEY ("id_postingan") REFERENCES "postingan"("id_postingan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bagikan" ADD CONSTRAINT "bagikan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

