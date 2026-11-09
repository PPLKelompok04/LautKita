-- CreateTable
CREATE TABLE "notifikasi" (
    "id_notifikasi" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "tautan" TEXT,
    "is_dibaca" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id_notifikasi")
);

-- CreateIndex
CREATE INDEX "notifikasi_id_user_is_dibaca_idx" ON "notifikasi"("id_user", "is_dibaca");

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

