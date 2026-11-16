-- PBI-01: hak akses halaman admin per role (ADMIN selalu boleh semua)
-- AlterTable
ALTER TABLE "roles" ADD COLUMN "hak_akses" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Petugas lapangan tetap punya akses yang sama seperti sebelumnya
UPDATE "roles" SET "hak_akses" = ARRAY['/admin/verifikasi-laporan', '/admin/tindak-lanjut', '/admin/verifikasi-hasil']::TEXT[]
WHERE "kode_role" = 'PETUGAS';
