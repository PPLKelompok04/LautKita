# LautKita — Aplikasi Web

Next.js 16 (App Router) + Prisma + PostgreSQL (Supabase) + NextAuth + Tailwind CSS.

## Menjalankan di laptop

```bash
npm install
cp .env.example .env          # lalu isi nilainya
npx prisma migrate deploy     # buat tabel di database
npx prisma db seed            # buat akun admin pertama
npm run dev
```

Buka http://localhost:3000/login dan masuk dengan akun admin dari `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

### Supabase Storage

Upload foto/dokumen langsung dari browser ke Supabase Storage. Buat bucket **public** bernama sesuai
`NEXT_PUBLIC_SUPABASE_BUCKET`, lalu di pengaturan bucket batasi tipe file `image/jpeg, image/png, application/pdf`
dan ukuran maksimal 10 MB.

## Struktur kode per PBI

Setiap PBI punya file sendiri supaya tidak saling bentrok:

| Bagian | Lokasi |
|---|---|
| Model database | `prisma/models/pbiXX-nama.prisma` |
| Migrasi | `prisma/migrations/<waktu>_pbiXX_nama/` |
| Validasi (zod) | `lib/validasi/<nama>.js` |
| Halaman & Server Action | `app/admin/<nama>/` |

Kode bersama: `lib/auth.js` (login & cek role), `lib/upload.js` + `components/InputFile.js` (upload file),
`components/PetaPilihLokasi.js` (pilih koordinat di peta), `components/admin/` (komponen form & tabel),
`lib/validasi/umum.js` (helper validasi).

Nama tabel & kolom di database memakai gaya `snake_case` (mis. `users.id_user`), tapi di kode JavaScript
tetap `camelCase` (mis. `user.id`). Pemetaannya ada di file `.prisma` lewat `@map` / `@@map`.

### Relasi antar-PBI: cukup hapus `//`

Prisma mewajibkan relasi ditulis di dua sisi. Supaya file PBI lain tidak perlu diedit sembarangan, baris relasi
balik **sudah disiapkan tapi dikomentari**, dan diberi label pemiliknya:

```prisma
  // program ProgramBudidaya[] // PBI-04
```

Saat meng-commit PBI-mu, cari baris yang berakhiran `// PBI-xx` milikmu (di `bersama-wilayah.prisma`,
`pbi01-user.prisma`, atau `pbi02-lokasi.prisma`), lalu hapus tanda `//` di **awal** baris itu. Selesai.

### Menambah model / mengubah database

1. Edit / buat file `prisma/models/pbiXX-*.prisma`
2. `npx prisma migrate dev --name pbiXX_keterangan`
3. Commit file `.prisma` dan folder migrasi yang baru dibuat

Setiap Server Action yang mengubah data **wajib** diawali `await requireRole("ADMIN")` (atau role lain yang sesuai).
