# 🚀 TravelVue Deployment Guide (Railway.app)

Panduan ini akan membantu Anda mendeploy aplikasi TravelVue ke cloud agar bisa diakses oleh siapa saja.

## 1. Persiapan GitHub
- Buat repository baru di GitHub (misal: `travelvue-fullstack`).
- Upload semua folder project ini ke sana.
- *Tips:* Pastikan folder `node_modules` **TIDAK** ikut terupload (sudah ada di `.gitignore`).

## 2. Persiapan Railway.app
1. Login ke [Railway.app](https://railway.app/) menggunakan akun GitHub Anda.
2. Klik **"New Project"** -> **"Deploy from GitHub repo"**.
3. Pilih repository `travelvue-fullstack`.

## 3. Tambah MySQL Database
1. Setelah project dibuat, klik **"Add Service"** (tombol +).
2. Pilih **"MySQL"**.
3. Tunggu hingga database selesai dibuat.

## 4. Konfigurasi Environment Variables
Klik pada service **Backend** Anda di dashboard Railway, lalu masuk ke tab **Variables**, tambahkan:
- `JWT_SECRET`: (Isi bebas, misal: `rahasia_travel_vue_2024`)
- `NODE_ENV`: `production`

Railway akan otomatis memberikan variabel `MYSQL_URL` yang sudah kita konfigurasi di kodingan.

## 5. Hubungkan Frontend & Backend
1. Di dashboard Railway, cek URL service Backend (misal: `https://backend-production-xyz.up.railway.app`).
2. Masuk ke tab **Variables** di service **Frontend**, tambahkan:
   - `VITE_API_URL`: `https://backend-production-xyz.up.railway.app/api`

## 6. Jalankan Seeder
Agar database online Anda terisi data destinasi dan user:
1. Buka dashboard Railway, pilih service **Backend**.
2. Klik tab **Settings** -> Cari bagian **Deployments** atau **Command**.
3. Jalankan perintah ini (bisa via terminal Railway):
   ```bash
   npm run seed
   ```

---
**Selesai!** Website Anda sekarang live dan siap dijadikan portofolio. 🎉
