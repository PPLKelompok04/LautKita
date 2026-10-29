-- CreateTable
CREATE TABLE "wilayah" (
    "id_wilayah" SERIAL NOT NULL,
    "nama_wilayah" TEXT NOT NULL,
    "kabupaten_kota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("id_wilayah")
);

-- CreateIndex
CREATE UNIQUE INDEX "wilayah_nama_wilayah_provinsi_key" ON "wilayah"("nama_wilayah", "provinsi");


-- Data awal: beberapa wilayah pesisir untuk demo
INSERT INTO "wilayah" ("nama_wilayah", "kabupaten_kota", "provinsi", "latitude", "longitude") VALUES
    ('Pangandaran', 'Kabupaten Pangandaran', 'Jawa Barat', -7.6966, 108.6539),
    ('Indramayu', 'Kabupaten Indramayu', 'Jawa Barat', -6.3275, 108.3249),
    ('Sayung', 'Kabupaten Demak', 'Jawa Tengah', -6.9234, 110.5143),
    ('Karimunjawa', 'Kabupaten Jepara', 'Jawa Tengah', -5.8389, 110.4301),
    ('Kepulauan Seribu Utara', 'Kabupaten Kepulauan Seribu', 'DKI Jakarta', -5.6197, 106.5642);
