# Phase 5 Debts

Dokumen ini menjelaskan implementasi awal debt module di frontend `moneypath-ui`.

Scope phase ini:

- debt list
- create debt
- debt detail
- edit debt
- inactivate debt

---

## Endpoint

Debt module memakai endpoint berikut:

- `GET /debts`
- `POST /debts`
- `GET /debts/{debtID}`
- `PUT /debts/{debtID}`
- `DELETE /debts/{debtID}`

Kontrak ini diambil dari backend lokal `moneypath-api`.

---

## Aturan Backend yang Penting

- create debt wajib mengirim `name` dan `principal_amount`
- update debt hanya mengubah metadata, bukan nilai pokok
- status debt diturunkan dari backend menjadi `active`, `lunas`, atau `inactive`
- debt hanya bisa dinonaktifkan jika `remaining_amount` sudah nol

---

## File Utama

- `src/pages/DebtPage.jsx`
- `src/pages/DebtDetailPage.jsx`
- `src/features/debts/debt-service.js`
- `src/features/debts/DebtForm.jsx`
- `src/features/debts/debt-utils.js`

---

## Struktur UI

Debt module dibagi menjadi:

- halaman list debt + form create
- halaman detail debt + form edit

Pendekatan ini dipakai supaya:

- daftar debt tetap mudah dipindai
- detail debt tetap jelas di mobile
- edit flow tetap sederhana dan tidak tersembunyi di modal

---

## Data yang Ditampilkan

Frontend menampilkan informasi berikut:

- nama debt
- principal amount
- remaining amount
- status
- tenor
- payment amount
- note
- riwayat mutasi terkait debt pada halaman detail

---

## Catatan UX Tambahan

- field nominal debt di UI dibatasi ke angka saja
- halaman detail debt menampilkan mutasi terkait debt tanpa harus pindah ke halaman mutation
- riwayat mutasi ini bersifat ringkas dan fokus ke context debt, bukan pengganti halaman mutation penuh

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- payment action debt
- riwayat pembayaran debt
- filter/search debt
- pagination UI
- integrasi debt ke mutation flow

---

## Next Step

Setelah debt module aman, langkah berikutnya adalah:

- verifikasi manual create/detail/edit/inactivate
- lanjut ke Phase 6 mutation module
