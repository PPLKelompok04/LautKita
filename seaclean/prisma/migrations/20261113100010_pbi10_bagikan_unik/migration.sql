-- PBI-10: satu repost per user per postingan
-- DropIndex
DROP INDEX IF EXISTS "bagikan_id_postingan_idx";

-- CreateIndex
CREATE UNIQUE INDEX "bagikan_id_postingan_id_user_key" ON "bagikan"("id_postingan", "id_user");
