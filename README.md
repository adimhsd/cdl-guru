# CDL Platform - Critical Digital Literacy

Platform edukasi interaktif berbasis kecerdasan buatan (AI) yang dirancang untuk membantu guru mengembangkan kemampuan literasi digital kritis. Platform ini akan digunakan untuk penelitian "Penelitian Hibah DPPM · Kemendiktisaintek RI 2026".

## Requirements (Prasyarat Sistem)

Sebelum memulai, pastikan sistem Anda telah memiliki:

- **Node.js**: Minimal versi 18.x atau terbaru.
- **PostgreSQL**: Server database aktif.
- **Ollama** (opsional/jika menggunakan AI lokal): Untuk menjalankan model AI (Gemma) secara lokal.

## Persiapan dan Instalasi

1. **Clone repositori**
   ```bash
   git clone <url-repo>
   cd cdl-platform
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env.local` di root folder proyek dan salin variabel berikut (sesuaikan kredensial database dan API key Anda):
   ```env
   # .env.local
   DATABASE_URL="postgresql://user:password@localhost:5432/cdl_guru?schema=public"
   AUTH_SECRET="secret_key_anda" # generate dengan: npx auth secret
   OPENAI_API_KEY="sk-..." # Jika menggunakan model dari OpenAI
   ```

## Konfigurasi Database & Seed

1. **Jalankan migrasi database (Prisma)**
   ```bash
   npx prisma db push
   # atau npx prisma migrate dev
   ```

2. **Menjalankan Seed Database**
   Perintah ini akan membuat 20 akun guru (`guru1@mail.com` - `guru20@mail.com`) dengan password `guru[x]` dan 1 akun admin (`admin@mail.com` / `admin123`).
   ```bash
   npm run db:seed
   ```
   *(Catatan: pastikan di `package.json` Anda terdapat script `"db:seed": "npx tsx prisma/seed.ts"` atau jalankan langsung `npx tsx prisma/seed.ts`)*

## Menggunakan Ollama Llama/Gemma (Opsional)

Jika instruksi penelitian memerlukan Anda untuk menjalankan model secara lokal menggunakan Ollama, Anda dapat menarik (pull) model yang telah ditentukan:

```bash
ollama pull gemma4:27b-it-qat_q4_K_M
```
*(Catatan: Sesuaikan endpoint AI di `src/app/api/ai/analyze/route.ts` jika Anda beralih dari OpenAI ke Ollama API lokal pada port `http://localhost:11434`)*

## Menjalankan Aplikasi (Development)

Untuk menjalankan server di environment development:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda. Aplikasi akan otomatis mengarahkan (redirect) ke `/login` jika Anda belum masuk.

## Struktur Folder Proyek

```text
cdl-platform/
├── prisma/                 # Skema Prisma, migrasi, dan seed database
│   ├── schema.prisma       # Skema tabel database (User, TestResult, Interaction)
│   └── seed.ts             # Skrip untuk memasukkan data awal guru dan admin
├── public/                 # Aset publik statis (gambar, ikon)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Routes (dashboard, ai analysis)
│   │   ├── dashboard/      # Halaman utama progress user
│   │   ├── login/          # Halaman otentikasi
│   │   ├── pretest/        # Modul tes awal
│   │   ├── ai/             # Modul chat interaksi AI Tutor
│   │   ├── posttest/       # Modul tes akhir
│   │   ├── layout.tsx      # Root layout aplikasi
│   │   └── page.tsx        # Entry point redirect ke dashboard/login
│   ├── components/         # Komponen React yang dapat digunakan ulang (Navbar, LevelBadge, ProgressBar, Footer)
│   ├── lib/                # Utilitas (instansiasi Prisma, AI prompts, actions)
│   ├── auth.ts             # Konfigurasi NextAuth.js
│   └── auth.config.ts      # Pengaturan otentikasi lanjutan
├── .env.local              # File environment variabel (tidak di-commit)
├── next.config.mjs         # Konfigurasi Next.js
├── package.json            # Daftar dependensi dan script NPM
├── tailwind.config.ts      # Konfigurasi Tailwind CSS
└── README.md               # Dokumentasi proyek (file ini)
```

## Alur Sistem & Route Guards (Testing Scenarios)

1. **Autentikasi (`/login`)**: User harus login. Semua halaman terproteksi.
2. **Pre-Test (`/pretest`)**: Wajib dilakukan pertama kali. Setelah selesai, tidak bisa diakses kembali.
3. **AI Tutor (`/ai`)**: Hanya bisa diakses jika sudah pre-test. Mengharuskan 5x interaksi untuk melanjutkan.
4. **Post-Test (`/posttest`)**: Membutuhkan pre-test selesai dan minimal 5 interaksi AI. Setelah post-test, dialihkan ke dashboard.
5. **Dashboard (`/dashboard`)**: Ringkasan perjalanan, skor, dan jumlah interaksi.

## Lisensi & Kredit
&copy; 2026 Penelitian Hibah DPPM · Kemendiktisaintek RI. All rights reserved.
Developed by [adi-muhamad.my.id](https://adi-muhamad.my.id/)
