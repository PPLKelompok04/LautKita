CREATE TABLE IF NOT EXISTS peringatan_postingan (
  id_peringatan SERIAL PRIMARY KEY,
  id_postingan  INTEGER NOT NULL REFERENCES postingan(id_postingan) ON DELETE CASCADE,
  id_admin      INTEGER NOT NULL,
  pesan         TEXT NOT NULL,
  created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS peringatan_postingan_id_postingan_idx
  ON peringatan_postingan(id_postingan);