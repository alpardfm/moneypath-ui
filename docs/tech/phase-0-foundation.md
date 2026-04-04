# Phase 0 Foundation

Dokumen ini menjelaskan fondasi teknis awal yang sudah dibuat untuk `moneypath-ui`.

Scope dokumen ini hanya untuk hasil **Phase 0 — Project Setup**.

---

## Tujuan

Phase 0 menyiapkan fondasi frontend yang:

- bisa dijalankan lokal
- punya struktur folder awal yang rapi
- sudah memakai Tailwind CSS
- sudah punya routing dasar
- sudah punya pola protected route
- sudah punya API client dasar
- sudah punya loading / empty / error UI primitives

Phase ini belum membangun flow bisnis utama.

---

## Stack

- React JS
- Vite
- Tailwind CSS
- React Router
- Fetch API
- ESLint

---

## Struktur Folder Saat Ini

```text
src/
  app/
    layout/
    providers/
    App.jsx
    router.jsx
  components/
    feedback/
    layout/
  features/
    auth/
  pages/
  services/
  utils/
  main.jsx
  index.css
```

Penjelasan singkat:

- `src/app`
  Tempat app-level wiring seperti router, provider, dan shell.
- `src/components`
  Reusable UI kecil yang tidak spesifik ke satu fitur.
- `src/features`
  Tempat logic/module yang spesifik ke domain tertentu.
- `src/pages`
  Route-level pages.
- `src/services`
  API access layer.
- `src/utils`
  Helper kecil yang tidak perlu abstraction berat.

---

## Routing

Routing didefinisikan di `src/app/router.jsx`.

Route yang tersedia saat ini:

- `/`
  Redirect ke `/app/dashboard`
- `/login`
  Halaman login placeholder untuk verifikasi auth foundation
- `/register`
  Halaman placeholder untuk fase auth nanti
- `/app/dashboard`
  Protected page placeholder
- `*`
  Fallback 404

Catatan:

- `createBrowserRouter` dipakai sebagai routing base.
- Route protected dibungkus oleh `ProtectedRoute`.
- Ini baru fondasi, belum final navigation untuk semua modul.

---

## Auth Foundation

Auth foundation dibuat sederhana dan sengaja belum overengineered.

Komponen utamanya:

- `src/app/providers/AuthProvider.jsx`
- `src/app/providers/useAuth.jsx`
- `src/app/providers/auth-context.jsx`
- `src/features/auth/ProtectedRoute.jsx`
- `src/utils/auth.js`

Perilaku saat ini:

- token disimpan di `localStorage`
- provider membaca token saat app load
- protected route mengecek apakah token tersedia
- jika tidak ada token, user diarahkan ke `/login`
- logout menghapus token

Token key yang dipakai:

```text
moneypath_token
```

Catatan penting:

- Ini baru auth foundation untuk setup awal
- belum ada integrasi login/register API
- belum ada refresh token
- belum ada profile bootstrap
- belum ada unauthorized redirect handling lintas request yang lengkap

Semua itu sengaja ditunda ke fase berikutnya.

---

## API Foundation

API client awal ada di `src/services/api.js`.

Tujuan layer ini:

- menyimpan base URL API di satu tempat
- otomatis menyisipkan bearer token jika ada
- memberi handling dasar untuk response `401`
- memberi wrapper sederhana untuk `GET`, `POST`, `PUT`, dan `PATCH`

Env yang dipakai:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Contoh file:

- `.env.example`

Catatan:

- response handling masih dibuat sederhana
- error mapping ke format backend belum dibuat detail
- belum ada helper per module seperti `authService`, `walletService`, dan seterusnya

Itu nanti ditambahkan saat modul terkait benar-benar mulai dikerjakan.

---

## Layout Foundation

Layout awal dibuat di:

- `src/app/layout/AppShell.jsx`
- `src/components/layout/PageContainer.jsx`

Tujuannya:

- memberi shell dasar yang konsisten
- menjaga lebar konten tetap nyaman dibaca
- memastikan layout usable di desktop dan mobile sejak awal

Prinsip layout saat ini:

- spacing sederhana
- tidak ramai
- tidak banyak ornamen
- tidak mengasumsikan desktop-only
- aman untuk screen kecil

---

## Shared Feedback Components

Komponen feedback dasar yang sudah tersedia:

- `src/components/feedback/LoadingState.jsx`
- `src/components/feedback/EmptyState.jsx`
- `src/components/feedback/ErrorState.jsx`

Komponen ini dipersiapkan lebih awal supaya setiap fase berikutnya punya pola tampilan state yang konsisten.

---

## Styling

Styling memakai Tailwind CSS.

Konfigurasi utama:

- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`

Arah styling saat ini:

- clean
- calm
- readable
- practical

Yang sengaja belum ada:

- theme system yang kompleks
- dark mode system
- custom design token yang berlebihan
- animation system yang besar

---

## Placeholder Pages

Beberapa halaman saat ini masih placeholder:

- `src/pages/LoginPage.jsx`
- `src/pages/RegisterPage.jsx`
- `src/pages/DashboardPage.jsx`
- `src/pages/NotFoundPage.jsx`

Tujuan placeholder ini:

- verifikasi routing
- verifikasi protected route
- verifikasi shell dan responsive spacing

Bukan untuk menandakan fitur sudah selesai.

---

## Menjalankan Project

```bash
npm install
npm run dev
```

Untuk verifikasi production build:

```bash
npm run build
```

Untuk lint:

```bash
npm run lint
```

---

## Validasi Manual Minimum

Checklist sederhana setelah menjalankan app:

1. Buka `/login`
2. Masuk ke demo shell
3. Pastikan redirect ke `/app/dashboard`
4. Refresh halaman dan cek route masih bisa diakses
5. Klik logout
6. Pastikan akses ke protected route kembali dibatasi
7. Cek tampilan mobile agar tidak overflow horizontal

---

## Yang Sengaja Belum Dibangun

Bagian berikut belum termasuk Phase 0:

- form login/register asli
- integrasi auth API
- dashboard API
- wallet module
- debt module
- mutation module
- summary module
- profile module
- delete mutation UI

---

## Next Step

Step berikut yang paling masuk akal:

- lanjut ke Phase 1 untuk memperkuat app shell dan responsive layout
- atau lanjut ke Phase 2 jika ingin mulai auth flow end-to-end
