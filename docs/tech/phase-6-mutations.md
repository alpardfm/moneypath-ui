# Phase 6 Mutations

Dokumen ini menjelaskan implementasi awal mutation module di frontend `moneypath-ui`.

Scope phase ini:

- mutation list
- create mutation
- edit mutation
- filter UI
- pagination UI
- relasi debt pada mutation

---

## Endpoint

Mutation module memakai endpoint berikut:

- `GET /mutations`
- `POST /mutations`
- `GET /mutations/{mutationID}`
- `PUT /mutations/{mutationID}`

Catatan penting:

- backend memang punya endpoint `DELETE /mutations/{mutationID}`
- tetapi backend secara eksplisit menolak delete
- frontend **tidak** menyediakan delete mutation UI

---

## Aturan Debt Relation

Frontend mengikuti aturan backend:

- jika `related_to_debt = false`
  - `debt_id` dan `new_debt` harus kosong
- jika `type = keluar` dan `related_to_debt = true`
  - wajib memilih existing debt
- jika `type = masuk` dan `related_to_debt = true`
  - harus memilih salah satu:
    - existing debt
    - new debt

---

## File Utama

- `src/pages/MutationPage.jsx`
- `src/pages/MutationEditPage.jsx`
- `src/features/mutations/mutation-service.js`
- `src/features/mutations/MutationForm.jsx`
- `src/features/mutations/mutation-utils.js`

---

## UI yang Dibangun

Halaman mutation list menyediakan:

- list mutasi
- filter tipe
- filter wallet
- filter debt
- filter related_to_debt
- filter rentang waktu
- sort by
- sort direction
- pagination next/prev
- form create mutation

Catatan UX tambahan:

- field nominal mutation dibatasi ke angka saja di UI
- `happened_at` untuk form create otomatis memakai waktu saat ini, tetapi tetap bisa diubah manual

Halaman edit mutation menyediakan:

- detail singkat mutasi
- form edit mutation
- pesan eksplisit bahwa delete mutation tidak tersedia

---

## Catatan Khusus Edit Borrow New

Jika mutation lama punya `debt_action = borrow_new`, frontend akan:

- membaca debt yang dibuat dari mutation tersebut
- memetakan data debt itu kembali ke form `new_debt`

Ini penting agar update mutation tidak salah berubah menjadi mode existing debt secara diam-diam.

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- delete mutation UI
- bulk action
- advanced search
- category system
- analytics mutation

---

## Next Step

Setelah mutation module aman, langkah berikutnya adalah:

- verifikasi manual create/edit/filter flow
- lanjut ke Phase 7 summary module
