-- CreateEnum
CREATE TYPE "StatusPeserta" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- CreateTable
CREATE TABLE "peserta_program" (
    "id_peserta" SERIAL NOT NULL,
    "id_program" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "motivasi" TEXT,
    "status" "StatusPeserta" NOT NULL DEFAULT 'MENUNGGU',
    "catatan_admin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peserta_program_pkey" PRIMARY KEY ("id_peserta")
);

-- CreateIndex
CREATE INDEX "peserta_program_id_user_idx" ON "peserta_program"("id_user");

-- CreateIndex
CREATE INDEX "peserta_program_status_idx" ON "peserta_program"("status");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_program_id_program_id_user_key" ON "peserta_program"("id_program", "id_user");

-- AddForeignKey
ALTER TABLE "peserta_program" ADD CONSTRAINT "peserta_program_id_program_fkey" FOREIGN KEY ("id_program") REFERENCES "program"("id_program") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_program" ADD CONSTRAINT "peserta_program_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

