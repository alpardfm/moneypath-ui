# Phase 3 Dashboard

Dokumen ini menjelaskan implementasi awal dashboard untuk `moneypath-ui`.

Dashboard pada fase ini fokus pada ringkasan cepat yang diambil dari backend, tanpa menambah analitik atau visualisasi yang di luar MVP.

---

## Endpoint

Frontend memakai endpoint:

```text
GET /dashboard
```

Kontrak ini diambil dari source of truth backend lokal `moneypath-api`.

---

## Shape Response

Response dashboard mengandung:

- `total_assets`
- `total_debts`
- `total_incoming`
- `total_outgoing`
- `net_flow`
- `wallets`

Setiap item wallet berisi:

- `wallet_id`
- `name`
- `balance`

---

## Implementasi Frontend

File utama:

- `src/pages/DashboardPage.jsx`
- `src/features/dashboard/dashboard-service.js`
- `src/utils/format-number.js`

Yang ditampilkan di dashboard:

- kartu total assets
- kartu total debts
- kartu total incoming
- kartu total outgoing
- ringkasan net flow
- daftar saldo wallet aktif

---

## State Handling

Dashboard menangani tiga state utama:

- loading
- error
- empty

Komponen shared yang dipakai:

- `LoadingState`
- `ErrorState`
- `EmptyState`

---

## Prinsip UI

Dashboard dibuat supaya:

- mudah dipindai
- tetap nyaman di mobile
- tidak terlalu ramai
- tidak memakai chart yang belum diperlukan

---

## Yang Sengaja Belum Dibangun

Phase ini belum mencakup:

- chart
- filter waktu
- wallet detail drilldown
- richer analytics

---

## Next Step

Setelah dashboard aman, langkah berikutnya adalah:

- verifikasi manual dengan data real
- lanjut ke Phase 4 wallet module
