# 🌍 TravelVue — Fullstack Travel Website

Website wisata fullstack dibangun dengan **Vue.js 3**, **TailwindCSS**, **Node.js/Express**, dan **MySQL**.

---

## 🚀 Cara Menjalankan

### 1. Persiapan Database MySQL

Pastikan MySQL sudah berjalan, lalu buat database:
```sql
CREATE DATABASE travelvue_db;
```

### 2. Konfigurasi Backend

Edit file `backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password_mysql_anda
DB_NAME=travelvue_db
JWT_SECRET=travelvue_secret_key_2024_secure
```

### 3. Jalankan Backend

```bash
cd backend

# Pertama kali: isi data contoh
npm run seed

# Jalankan server
npm run dev
```

Server berjalan di: http://localhost:3000

### 4. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Website berjalan di: http://localhost:5173

---

## 👥 Akun Demo

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| Admin | admin@travelvue.com      | admin123  |
| User  | budi@example.com         | user123   |

---

## 📁 Struktur Proyek

```
website traveling/
├── backend/          ← Node.js + Express + MySQL
│   ├── config/       ← Database connection
│   ├── controllers/  ← Business logic
│   ├── middleware/   ← Auth & upload middleware
│   ├── models/       ← Sequelize models
│   ├── routes/       ← API routes
│   ├── uploads/      ← Uploaded images
│   ├── server.js     ← Entry point
│   └── seeder.js     ← Sample data seeder
│
└── frontend/         ← Vue.js 3 + Vite + TailwindCSS
    └── src/
        ├── components/  ← Reusable components
        ├── pages/       ← Route pages
        │   └── admin/   ← Admin panel pages
        ├── router/      ← Vue Router
        ├── services/    ← Axios API client
        └── stores/      ← Pinia state management
```

---

## 🎯 Fitur

### Publik
- 🏠 Halaman beranda dengan hero, destinasi unggulan, paket wisata
- 🗺️ Daftar destinasi dengan filter kategori & pencarian
- 📦 Detail paket wisata dengan itinerary
- ⭐ Testimoni pelanggan

### User (Login Required)
- 📝 Formulir pemesanan paket wisata
- 📋 Riwayat & status booking

### Admin Panel
- 📊 Dashboard dengan statistik
- 🗺️ CRUD destinasi wisata
- 📦 CRUD paket wisata
- 📋 Manajemen booking dengan update status

---

## 🛠️ Tech Stack

| Layer    | Teknologi                        |
|----------|----------------------------------|
| Frontend | Vue.js 3, Vite, TailwindCSS v3   |
| State    | Pinia                            |
| Router   | Vue Router 4                     |
| HTTP     | Axios                            |
| Backend  | Node.js, Express.js              |
| Database | MySQL + Sequelize ORM            |
| Auth     | JWT (JSON Web Tokens)            |
| Upload   | Multer                           |
