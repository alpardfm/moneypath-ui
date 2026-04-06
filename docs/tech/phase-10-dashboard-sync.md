# Phase 10 Backend Sync

Dokumen ini mencatat slice awal Phase 10 yang fokus ke sinkronisasi UI dengan endpoint backend terbaru yang paling dekat ke flow existing.

## Scope

- konsumsi `monthly_trend` dari `GET /dashboard`
- konsumsi `outgoing_categories` dari `GET /dashboard`
- konsumsi `GET /wallets/archive`
- konsumsi `GET /debts/archive`
- konsumsi `GET /notifications`
- konsumsi `GET /settings` dan `PUT /settings`
- konsumsi `GET /financial-health`
- konsumsi `GET /leakage-detection`
- konsumsi `GET /exports/mutations.csv`
- konsumsi `GET/POST/DELETE /categories`
- tampilkan visual sederhana tanpa library chart tambahan
- tetap jaga mobile readability dan MVP-first

## Perubahan Utama

- dashboard sekarang membaca `monthly_trend` dan `outgoing_categories`
- tren bulanan ditampilkan sebagai daftar bar sederhana untuk `masuk` dan `keluar`
- breakdown kategori pengeluaran ditampilkan sebagai daftar progress bar per kategori
- helper normalisasi dashboard ditambahkan agar parsing angka dan label bulan tetap konsisten
- halaman wallet sekarang punya section arsip wallet nonaktif
- halaman debt sekarang punya section arsip debt nonaktif
- halaman notifikasi sekarang menampilkan pengingat recurring dan debt aktif dari backend
- halaman profil sekarang punya section preferensi untuk currency, timezone, format tanggal, dan awal minggu
- dashboard sekarang menampilkan skor kesehatan keuangan sebagai ringkasan cepat
- summary sekarang menampilkan leakage detection 30 hari sebagai insight analitis
- halaman mutasi sekarang punya tombol export CSV yang mengikuti filter aktif
- filter mutasi sekarang juga mendukung kategori aktif dan tombol atur ulang filter agar pemakaian riwayat lebih cepat
- halaman profil sekarang menampilkan ringkasan preferensi aktif dan hanya mengaktifkan aksi simpan pengaturan saat memang ada perubahan
- dashboard sekarang punya blok sorotan cepat untuk snapshot bulan terbaru, kategori pengeluaran terbesar, dan wallet dengan saldo tertinggi
- workflow deploy sekarang memakai artifact build tunggal, environment produksi, concurrency guard, dan backup release terakhir di server untuk rollback manual cepat
- halaman mutasi sekarang juga punya section kategori untuk list, tambah, dan nonaktifkan kategori

## File Utama

- `src/pages/DashboardPage.jsx`
- `src/pages/WalletPage.jsx`
- `src/pages/DebtPage.jsx`
- `src/pages/NotificationsPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/pages/MutationPage.jsx`
- `src/features/dashboard/dashboard-utils.js`
- `src/features/wallets/wallet-service.js`
- `src/features/debts/debt-service.js`
- `src/features/notifications/notification-service.js`
- `src/features/notifications/notification-utils.js`
- `src/features/settings/settings-service.js`
- `src/features/settings/settings-utils.js`
- `src/features/healthscore/healthscore-service.js`
- `src/features/healthscore/healthscore-utils.js`
- `src/features/leakage/leakage-service.js`
- `src/features/leakage/leakage-utils.js`
- `src/features/categories/category-service.js`
- `src/features/categories/category-utils.js`
- `src/components/charts/TrendBarChart.jsx`
- `src/components/charts/CategoryBreakdownChart.jsx`

## Catatan

- visual chart sengaja dibuat ringan dan tidak memakai dependency tambahan
- kontrak endpoint baru diverifikasi dengan source backend lokal sebelum disambungkan ke UI
