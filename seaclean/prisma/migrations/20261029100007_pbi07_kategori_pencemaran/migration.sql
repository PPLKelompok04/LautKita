-- CreateEnum
CREATE TYPE "JenisPencemaran" AS ENUM ('SAMPAH', 'LIMBAH', 'MINYAK', 'ALAT_TANGKAP_MERUSAK');

-- CreateEnum
CREATE TYPE "TingkatKeparahan" AS ENUM ('RINGAN', 'SEDANG', 'PARAH');

-- CreateTable
CREATE TABLE "kategori_pencemaran" (
    "id_kategori" SERIAL NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "jenis" "JenisPencemaran" NOT NULL,
    "tingkat_keparahan" "TingkatKeparahan" NOT NULL,
    "warna_marker" TEXT NOT NULL,
    "deskripsi" TEXT,
    "ikon_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_pencemaran_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategori_pencemaran_nama_kategori_key" ON "kategori_pencemaran"("nama_kategori");

-- CreateIndex
CREATE INDEX "kategori_pencemaran_is_active_jenis_idx" ON "kategori_pencemaran"("is_active", "jenis");


-- Data awal kategori (sesuai mockup Lapor Pencemaran)
INSERT INTO "kategori_pencemaran" ("nama_kategori", "jenis", "tingkat_keparahan", "warna_marker", "deskripsi", "updated_at") VALUES
    ('Sampah Plastik', 'SAMPAH', 'SEDANG', '#eab308', 'Sampah plastik di pantai atau perairan', CURRENT_TIMESTAMP),
    ('Styrofoam', 'SAMPAH', 'RINGAN', '#16a34a', 'Sampah styrofoam di pantai', CURRENT_TIMESTAMP),
    ('Limbah Kimia', 'LIMBAH', 'PARAH', '#dc2626', 'Pembuangan limbah industri atau bahan kimia ke laut', CURRENT_TIMESTAMP),
    ('Tumpahan Minyak', 'MINYAK', 'PARAH', '#dc2626', 'Tumpahan minyak dari kapal atau pipa', CURRENT_TIMESTAMP),
    ('Pukat Harimau', 'ALAT_TANGKAP_MERUSAK', 'PARAH', '#dc2626', 'Penangkapan ikan dengan pukat harimau (trawl) yang merusak dasar laut', CURRENT_TIMESTAMP),
    ('Bom Ikan / Potasium', 'ALAT_TANGKAP_MERUSAK', 'PARAH', '#dc2626', 'Penangkapan ikan dengan bahan peledak atau racun', CURRENT_TIMESTAMP);
