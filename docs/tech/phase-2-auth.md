# Phase 2 Auth Flow

Dokumen ini menjelaskan implementasi awal auth flow pada frontend `moneypath-ui`.

Scope dokumen ini hanya untuk Phase 2:

- login page
- register page
- token storage
- protected route behavior
- logout flow
- auth error handling

---

## Komponen Utama

- `src/pages/LoginPage.jsx`
- `src/pages/RegisterPage.jsx`
- `src/features/auth/auth-service.js`
- `src/features/auth/ProtectedRoute.jsx`
- `src/features/auth/PublicOnlyRoute.jsx`
- `src/app/providers/AuthProvider.jsx`
- `src/utils/auth.js`

---

## Alur Login

1. User mengisi email dan password di halaman login
2. Frontend melakukan validasi dasar
3. Request dikirim ke backend auth login
4. Jika token ditemukan di response, token disimpan ke local storage
5. User diarahkan ke halaman protected yang diminta sebelumnya, atau ke dashboard

---

## Alur Register

1. User mengisi nama, email, password, dan konfirmasi password
2. Frontend melakukan validasi dasar
3. Request dikirim ke backend auth register
4. Jika backend mengembalikan token, user langsung dianggap login
5. Jika backend tidak mengembalikan token, user diarahkan ke login dengan pesan sukses

---

## Protected Route

Protected route memakai dua pola:

- `ProtectedRoute`
  Untuk membatasi halaman app yang butuh auth
- `PublicOnlyRoute`
  Untuk mencegah user yang sudah login kembali ke login/register

Saat token hilang atau dibersihkan, route protected akan mengarahkan user kembali ke login.

---

## Token Storage

Token disimpan di local storage dengan key:

```text
moneypath_token
```

Provider auth akan:

- membaca token saat app load
- sinkron dengan perubahan auth event
- menghapus token saat logout

---

## Auth Response Assumption

Karena kontrak mentah Swagger tidak terbaca langsung dari environment ini, auth service dibuat fleksibel terhadap beberapa bentuk response token yang umum:

- `token`
- `access_token`
- `accessToken`
- nested token di `data`

Asumsi endpoint yang dipakai saat ini:

- `POST /auth/login`
- `POST /auth/register`

Jika backend final memakai path atau payload field yang sedikit berbeda, penyesuaian cukup dilakukan di `src/features/auth/auth-service.js`.

---

## Yang Sudah Ditangani

- validasi form dasar
- loading submit state
- visible error message
- redirect setelah login
- logout dari app shell
- redirect ketika session berakhir

---

## Yang Belum Ditangani

- refresh token flow
- bootstrap user profile
- remember me
- forgot password
- field-level mapping error yang sangat spesifik per backend

---

## Next Step

Setelah auth flow backend terverifikasi manual, langkah natural berikutnya adalah:

- finalisasi checklist integrasi auth di TODO
- lanjut ke Phase 3 dashboard
