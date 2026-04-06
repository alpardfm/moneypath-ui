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
- guard auth publik dan privat sekarang sama-sama menunggu status sesi siap sebelum melakukan redirect
- error handling service sekarang memakai helper bersama, dan parsing response API dibuat lebih aman untuk empty response atau nested backend error
- banner sukses berulang di beberapa halaman dirapikan ke komponen bersama agar tampilan dan spacing-nya konsisten
- header halaman utama seperti dashboard, wallet, debt, mutasi, ringkasan, dan profil sekarang memakai pola shared header agar ritme spacing dan ukuran judul lebih konsisten
- cabang navigasi yang sudah tidak dipakai lagi dibersihkan dari app shell untuk mengurangi dead code ringan
- density card di mobile diringankan sedikit, dan beberapa halaman detail dipadatkan agar heading, tombol, dan metadata panjang lebih aman di layar kecil

---

## Yang Masih Belum Ditutup

Polishing ini belum mencakup:

- review manual semua flow mayor
- audit penuh seluruh copy kecil di setiap komponen
- pembersihan menyeluruh untuk semua dead code
