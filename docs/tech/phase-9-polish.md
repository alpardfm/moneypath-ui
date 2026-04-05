# Phase 9 Polish

Dokumen ini mencatat polishing awal yang dilakukan setelah phase inti selesai.

Scope polishing saat ini:

- merapikan copy UI yang masih campur Bahasa Indonesia dan Inggris
- menstandarkan beberapa label loading, status, dan aksi
- mengurangi istilah backend mentah yang bocor ke UI
- merapikan friksi kecil pada form dan halaman detail

---

## Perubahan Utama

- default `LoadingState` sekarang memakai copy Bahasa Indonesia
- label metrik dashboard dan summary dirapikan ke istilah yang lebih konsisten
- halaman wallet, debt, mutasi, profil, login, register, dan not-found dirapikan copy-nya
- beberapa istilah teknis seperti `Debt linked`, `Delete`, `Page`, `Prev`, `Next`, dan `Balance` diganti ke bentuk UI yang lebih natural
- detail mutasi sekarang menampilkan label aksi debt yang lebih mudah dipahami daripada nilai mentah backend

---

## Yang Masih Belum Ditutup

Polishing ini belum mencakup:

- review manual semua flow mayor
- audit penuh seluruh copy kecil di setiap komponen
- refactor pengulangan UI yang lebih dalam
- pembersihan menyeluruh untuk semua dead code

