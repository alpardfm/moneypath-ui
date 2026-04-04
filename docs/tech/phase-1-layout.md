# Phase 1 Layout System

Dokumen ini menjelaskan fondasi layout yang ditambahkan pada **Phase 1 — App Shell & Responsive Layout**.

Phase ini fokus pada struktur UI bersama yang akan dipakai oleh module berikutnya, bukan pada data atau flow bisnis.

---

## Tujuan

Phase 1 memperkuat fondasi UI supaya:

- app punya shell utama yang konsisten
- desktop dan mobile sama-sama usable
- spacing dan content width tidak acak
- page-level sections punya pola card yang seragam
- loading, empty, dan error state punya tampilan yang konsisten

---

## Komponen Utama

### `src/app/layout/AppShell.jsx`

Shell utama untuk area protected app.

Isi utamanya:

- sticky header
- desktop navigation
- mobile bottom navigation
- area konten utama untuk `Outlet`

Pendekatan ini dipilih supaya:

- desktop tetap mudah discan
- mobile action tetap reachable
- layout tetap sederhana dan tidak butuh state/menu system yang berlebihan

---

### `src/components/layout/PageContainer.jsx`

Wrapper untuk mengatur:

- max width
- horizontal padding
- content size variant

Variant size saat ini:

- `narrow`
- `app`
- `wide`

Tujuan komponen ini adalah menjaga lebar konten tetap konsisten antar halaman.

---

### `src/components/layout/SectionCard.jsx`

Reusable card wrapper untuk section-level UI.

Tone yang tersedia:

- `default`
- `subtle`
- `muted`

Komponen ini dipakai untuk:

- card konten utama
- aside/info block
- placeholder page surface
- feedback state wrapper

---

## Navigasi Responsif

Pola navigasi saat ini:

- desktop memakai nav pill di header
- mobile memakai nav bar fixed di bawah

Catatan:

- item yang belum masuk scope module tetap ditampilkan sebagai disabled state
- ini sengaja dilakukan agar struktur app sudah terasa jelas tanpa memalsukan flow yang belum dibangun

---

## Spacing Rules

Aturan spacing yang dipakai saat ini:

- page container punya horizontal padding yang stabil dari mobile ke desktop
- main content memakai vertical spacing `py-6` dan `sm:py-8`
- section card memakai padding default yang aman untuk layar kecil
- layout grid hanya dipakai saat breakpoint cukup lebar

Prinsipnya:

- mobile-first
- tidak ada horizontal overflow
- tidak mengandalkan desktop width

---

## Feedback State Pattern

Komponen berikut memakai surface yang konsisten:

- `LoadingState`
- `EmptyState`
- `ErrorState`

Tujuannya:

- semua state terasa satu sistem
- tiap module berikutnya bisa reuse komponen yang sama
- tampilan tetap calm dan practical

---

## Halaman yang Sudah Memakai Layout Baru

- `src/pages/DashboardPage.jsx`
- `src/pages/LoginPage.jsx`
- `src/pages/RegisterPage.jsx`
- `src/pages/NotFoundPage.jsx`

Halaman ini masih placeholder secara fitur, tetapi sudah dipakai untuk memverifikasi pola layout bersama.

---

## Yang Sengaja Belum Ada

Phase 1 belum mencakup:

- auth API
- dashboard data
- wallet/debt/mutation pages
- drawer/sidebar kompleks
- animation-heavy navigation
- dark mode

---

## Next Step

Step berikut yang natural setelah Phase 1:

- lanjut ke Phase 2 untuk auth flow nyata
- atau mulai merapikan kontrak API auth dari Swagger sebelum implementasi form
