<p align="center">
  <img src="https://img.shields.io/badge/Garasiffy-Premium%20Car%20Modification-FF4500?style=for-the-badge&logo=car&logoColor=white" alt="Garasiffy Badge">
</p>

<h1 align="center">🚗 Garasiffy - Web Admin Panel</h1>

<p align="center">
  <strong>Sistem Manajemen Bengkel Modifikasi Digital</strong><br>
  Admin Panel berbasis Laravel untuk mengelola operasional bengkel modifikasi kendaraan
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=flat-square&logo=laravel" alt="Laravel">
  <img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php" alt="PHP">
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/Node.js-API-339933?style=flat-square&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## 📋 Tentang Proyek

**Garasiffy Web Admin Panel** adalah aplikasi backend berbasis Laravel yang digunakan untuk mengelola operasional bengkel modifikasi kendaraan. Proyek ini merupakan bagian dari ekosistem Garasiffy yang mencakup aplikasi mobile dan web untuk konsumen.

Referensi proyek: [Garasiffy_project](https://github.com/tech0608/Garasiffy_project)

### 🎯 Tujuan Aplikasi

- ✅ Mengelola antrian kendaraan dengan sistematis
- ✅ Memantau progress pekerjaan setiap mekanik
- ✅ Mengalokasikan resources (mekanik, peralatan) dengan efisien
- ✅ Memberikan transparansi kepada konsumen
- ✅ Menghasilkan laporan dan analytics untuk business insights

---

## 🛠️ Tech Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Laravel** | 12.x | PHP Framework untuk backend |
| **PHP** | 8.2+ | Server-side programming |
| **Firebase Firestore** | - | NoSQL Database |
| **Node.js** | - | REST API Server |
| **Express.js** | - | Node.js Framework |
| **Vite** | - | Build tool untuk assets |

---

## 🔐 Fitur Autentikasi

### Auth Login menggunakan Cookies

Sistem autentikasi menggunakan **Session-based Authentication** dengan penyimpanan cookies:

```php
// Login berhasil - menyimpan session ke cookies
session(['user_id' => 'admin']);
session(['role' => 'admin']);

// Logout - menghapus semua session
session()->flush();
```

**Alur Autentikasi:**

1. User mengakses halaman login (`/login`)
2. User memasukkan email dan password
3. Sistem memvalidasi kredensial
4. Jika valid, session disimpan di cookies
5. User diarahkan ke dashboard
6. Setiap request, middleware mengecek session dari cookies

**Kredensial Default Admin:**
- Email: `admin@garasifyy.com`
- Password: `admin123`

**Rute Autentikasi:**

| Method | Route | Fungsi |
|--------|-------|--------|
| GET | `/login` | Menampilkan halaman login |
| POST | `/login` | Proses autentikasi |
| GET | `/logout` | Logout dan hapus session |
| GET | `/dashboard` | Halaman dashboard (protected) |

---

## 📊 CRUD Data

### Entitas Data yang Dikelola

#### 1. **Projects (Proyek Modifikasi)**
```
├── id           : String (unique identifier)
├── serviceType  : String (jenis layanan)
├── plateNumber  : String (nomor plat kendaraan)
├── carModel     : String (model kendaraan)
├── status       : Enum ['waiting', 'on_progress', 'completed']
├── bookingDate  : DateTime
└── totalCost    : Number (biaya total)
```

#### 2. **Services (Layanan)**
- Engine Upgrade - Modifikasi mesin dan performa
- Body Paint - Pengecatan bodi kendaraan
- Interior - Modifikasi interior
- Audio - Instalasi sistem audio
- Exterior - Modifikasi eksterior

#### 3. **Customers (Pelanggan)**
- Data customer dengan riwayat transaksi

#### 4. **Cars (Kendaraan)**
- Data kendaraan yang terdaftar dalam sistem

### API Endpoints (Node.js Server)

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/auth/*` | - | Autentikasi user |
| `/api/projects/*` | CRUD | Manajemen proyek |
| `/api/services/*` | CRUD | Manajemen layanan |
| `/api/customers/*` | CRUD | Manajemen pelanggan |
| `/api/cars/*` | CRUD | Manajemen kendaraan |

---

## 🚀 Instalasi & Setup

### Prasyarat

- PHP >= 8.2
- Composer
- Node.js & NPM
- Firebase Account (untuk Firestore)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd Garasifyy_Web
   ```

2. **Install Dependensi PHP**
   ```bash
   composer install
   ```

3. **Install Dependensi Node.js**
   ```bash
   npm install
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Konfigurasi Firebase**
   - Letakkan file service account JSON di root project
   - Update nama file di `AdminController.php`

6. **Jalankan Development Server**
   ```bash
   # Laravel
   php artisan serve
   
   # Vite (untuk assets)
   npm run dev
   
   # API Server (opsional)
   cd api && node server.js
   ```

### Quick Setup (Composer Script)
```bash
composer run setup
composer run dev
```

---

## 📁 Struktur Proyek

```
Garasifyy_Web/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php    # Autentikasi
│   │       └── AdminController.php   # Dashboard & CRUD
│   └── Models/
├── api/                              # Node.js API Server
│   ├── routes/
│   │   ├── auth.js                   # Auth routes
│   │   ├── projects.js               # Projects CRUD
│   │   ├── services.js               # Services CRUD
│   │   ├── customers.js              # Customers CRUD
│   │   └── cars.js                   # Cars CRUD
│   └── server.js                     # Express server
├── resources/
│   └── views/
│       ├── login.blade.php
│       └── dashboard.blade.php
├── routes/
│   └── web.php                       # Web routes
├── config/
├── public/
└── ...
```

---

## 🎨 Fitur Utama

### 📅 Booking System
- Browse layanan modifikasi yang tersedia
- Pemesanan dengan entry otomatis ke antrian
- Estimasi waktu berdasarkan kapasitas bengkel

### 📊 Queue Management
- Dashboard antrian real-time
- Status pengerjaan (waiting/on_progress/completed)
- Prioritas antrian

### 📈 Progress Tracking
- Update persentase progres
- Timeline pengerjaan
- Notifikasi status

### 📱 Dashboard & Analytics
- Statistik performa bengkel
- Laporan pekerjaan
- Analisis efisiensi

---

## 👥 Tim Pengembang

- **Developer**: Luthfy Arief
- **Institusi**: Universitas Teknologi Bandung (UTB)
- **Mata Kuliah**: UAS Mobile Programming 2

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pendidikan.

```
© 2026 Garasify - Premium Car Modification Platform. All rights reserved.
```

---

<p align="center">
  <strong>Garasiffy</strong> - One Stop Modification 🚗✨
</p>
