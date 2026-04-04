# Phase 8 Profile

Dokumen ini menjelaskan implementasi awal profile module di frontend `moneypath-ui`.

Scope phase ini:

- profile page
- get current profile
- update profile
- change password
- success dan error feedback

---

## Endpoint

Profile module memakai endpoint berikut:

- `GET /me`
- `PUT /me`
- `PUT /me/password`

Kontrak ini diambil dari backend lokal `moneypath-api`.

---

## Payload yang Dipakai

Update profil:

- `email`
- `username`
- `full_name`

Ganti password:

- `current_password`
- `new_password`

---

## File Utama

- `src/pages/ProfilePage.jsx`
- `src/features/profile/profile-service.js`
- `src/features/profile/profile-utils.js`

---

## Struktur UI

Halaman profil dibagi menjadi dua area utama:

- form data akun
- form ganti password

Pendekatan ini dipilih supaya:

- user tidak perlu pindah halaman untuk tugas profil dasar
- update data dan keamanan akun tetap terpisah secara visual
- layout tetap nyaman di mobile dan desktop

---

## Catatan UX

- form tetap sederhana dan tidak menambahkan pengaturan akun yang belum dibutuhkan MVP
- success dan error feedback ditampilkan dekat dengan form yang relevan
- reset form tersedia untuk profil dan password agar pengguna bisa kembali ke kondisi awal dengan cepat

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- avatar
- upload foto
- pengaturan sesi perangkat
- preferensi akun lanjutan
