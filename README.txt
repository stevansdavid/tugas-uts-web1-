# BOOKSTORE - UTS PEMROGRAMAN WEB 1

## DESKRIPSI PROJECT

BookStore merupakan aplikasi pemesanan buku online berbasis HTML, CSS, dan JavaScript yang dibuat untuk memenuhi tugas Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web 1.

Aplikasi ini menyediakan fitur login pengguna, dashboard, katalog dan pengelolaan stok buku, pemesanan buku, serta pelacakan pengiriman menggunakan nomor Delivery Order (DO).

## CARA MENJALANKAN

1. Ekstrak file ZIP project.
2. Pastikan struktur folder tidak berubah.
3. Buka folder project menggunakan Visual Studio Code.
4. Jalankan `index.html` menggunakan Live Server.
5. Login menggunakan salah satu akun dari dosen.

## AKUN LOGIN

Berikut akun pengguna yang tersedia sesuai file `data.js` dari dosen.

| Nama | Email | Password | Role |
|---|---|---|---|
| Rina Wulandari | rina@gmail.com | rina123 | User |
| Agus Pranoto | agus@gmail.com | agus123 | User |
| Siti Marlina | siti@gmail.com | siti123 | Admin |

## HALAMAN APLIKASI

| File | Keterangan |
|---|---|
| `index.html` / `login.html` | Halaman Login |
| `dashboard.html` | Dashboard |
| `stok.html` | Katalog dan Pengelolaan Stok |
| `checkout.html` | Pemesanan / Checkout |
| `tracking.html` | Pelacakan Delivery Order |

## FITUR APLIKASI

1. Login menggunakan email dan password.
2. Dashboard dengan informasi dan navigasi aplikasi.
3. Menampilkan katalog buku berdasarkan data dosen.
4. Menambahkan dan mengelola stok buku.
5. Melakukan pemesanan dan checkout buku.
6. Menampilkan informasi transaksi.
7. Melacak pengiriman menggunakan nomor Delivery Order.

## DATA DAN GAMBAR

- `js/data.js` berisi data `dataPengguna`, `dataKatalogBuku`, dan `dataTracking` dari dosen.
- `img/` berisi lima file gambar buku yang diberikan dosen.
- `js/script.js` mengatur login, manipulasi DOM, checkout, dan tracking.
- `css/style.css` mengatur tampilan aplikasi.

## NOMOR DO UNTUK UJI TRACKING

Gunakan nomor berikut untuk mencoba fitur pelacakan:

- `20230012`
- `20230013`

## DOKUMENTASI SCREENSHOT

Berikut merupakan dokumentasi tampilan dan hasil pengujian aplikasi BookStore.

![Screenshot 2026-11-04 091901.png](screenshots/Screenshot%202026-11-04%20091901.png)

![Screenshot 2026-11-04 091942.png](screenshots/Screenshot%202026-11-04%20091942.png)

![Screenshot 2026-11-04 093544.png](screenshots/Screenshot%202026-11-04%20093544.png)

![Screenshot 2026-11-04 093612.png](screenshots/Screenshot%202026-11-04%20093612.png)

![Screenshot 2026-11-04 093640.png](screenshots/Screenshot%202026-11-04%20093640.png)

![Screenshot 2026-11-04 093648.png](screenshots/Screenshot%202026-11-04%20093648.png)

![Screenshot 2026-11-04 093700.png](screenshots/Screenshot%202026-11-04%20093700.png)

![Screenshot 2026-11-04 093753.png](screenshots/Screenshot%202026-11-04%20093753.png)

![Screenshot 2026-11-04 093857.png](screenshots/Screenshot%202026-11-04%20093857.png)

![Screenshot 2026-11-04 093924.png](screenshots/Screenshot%202026-11-04%20093924.png)

## VIDEO DEMONSTRASI

Link YouTube: -

## REPOSITORY

Link GitHub: -

## CATATAN

Aplikasi ini merupakan simulasi front-end tanpa server/database. Data perubahan katalog, transaksi, dan tracking pesanan baru disimpan menggunakan `localStorage` browser. Data awal pengguna, katalog, dan tracking berasal dari file dosen.