# Phase 7 Summary

Dokumen ini menjelaskan implementasi awal summary module di frontend `moneypath-ui`.

Scope phase ini:

- summary page
- connect summary API
- date range input
- total assets
- total debts
- total incoming
- total outgoing
- net flow
- loading, empty, dan error state

---

## Endpoint

Summary module memakai endpoint berikut:

- `GET /summary`

Filter yang dipakai:

- `from=YYYY-MM-DD`
- `to=YYYY-MM-DD`

Kontrak ini diambil dari backend lokal `moneypath-api`.

---

## Aturan Backend yang Penting

- filter `from` dan `to` bersifat opsional
- format tanggal untuk summary adalah `YYYY-MM-DD`
- response summary mengembalikan:
  - `total_assets`
  - `total_debts`
  - `total_incoming`
  - `total_outgoing`
  - `net_flow`
  - `wallets`
  - `from`
  - `to`

---

## File Utama

- `src/pages/SummaryPage.jsx`
- `src/features/summary/summary-service.js`
- `src/features/summary/summary-utils.js`

---

## Struktur UI

Halaman summary dibagi menjadi:

- header dan penjelasan singkat
- filter periode
- kartu metrik ringkasan
- kartu net flow
- daftar saldo wallet aktif

Pendekatan ini dipakai supaya:

- dashboard tetap menjadi quick overview
- summary menjadi tempat ringkasan berbasis periode
- layout tetap nyaman di mobile tanpa menambah chart atau analitik berat

---

## Catatan UX

- default filter memakai bulan berjalan agar halaman langsung punya konteks periode
- user tetap bisa mengganti tanggal mulai dan selesai kapan saja
- tombol reset mengembalikan filter ke periode bulan berjalan

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- chart
- compare period
- export summary
- filter dashboard
- analitik lanjutan

