# Phase 4 Wallet Module

Dokumen ini menjelaskan implementasi awal wallet module di frontend `moneypath-ui`.

Scope phase ini:

- wallet list
- create wallet
- edit wallet
- inactivate wallet
- empty state
- validation dan error state

---

## Endpoint

Wallet module memakai endpoint berikut:

- `GET /wallets`
- `POST /wallets`
- `PUT /wallets/{walletID}`
- `DELETE /wallets/{walletID}`

Kontrak ini diambil dari backend lokal `moneypath-api`.

---

## Aturan Backend yang Penting

- request create wallet hanya butuh `name`
- request update wallet hanya butuh `name`
- list wallet mengembalikan wallet aktif
- inactivate wallet hanya bisa berhasil jika balance wallet nol

Karena itu frontend:

- tidak memberi UI edit balance
- menampilkan status active dengan jelas
- men-disable tombol nonaktifkan jika balance belum nol

---

## File Utama

- `src/pages/WalletPage.jsx`
- `src/features/wallets/wallet-service.js`
- `src/features/wallets/WalletForm.jsx`

---

## Struktur UI

Halaman wallet dibagi menjadi dua area utama:

- area list wallet aktif
- area form create/edit wallet

Pendekatan ini dipilih supaya:

- desktop tetap nyaman karena list dan form bisa berdampingan
- mobile tetap sederhana karena semua konten tetap menumpuk secara natural

---

## State Handling

Wallet page menangani state berikut:

- loading list
- error list
- empty wallet state
- submit loading
- submit success
- submit error
- edit mode
- inactivate in progress

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- wallet detail page terpisah
- pagination UI
- filter/search wallet
- riwayat mutasi per wallet

---

## Next Step

Setelah wallet module aman, langkah berikutnya adalah:

- verifikasi manual create/edit/inactivate
- lanjut ke Phase 5 debt module
