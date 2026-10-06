# Portfolio Andika Saputra (Neo-Brutalist)

Website portfolio single-page (satu halaman) untuk Andika Saputra yang dirancang dengan sistem desain "Acid Drop" bertema Neo-Brutalist. Dibangun menggunakan HTML, Tailwind CSS (dengan build process), dan Vanilla JavaScript murni.

## Fitur Utama
*   **Desain Neo-Brutalist**: Palet warna *Paper* (#F8F4E8), *Ink* (#09090B), dan *Acid* (#D2E823) dengan border tebal dan hard shadow (tanpa blur).
*   **Mode Gelap / Terang**: Mendukung mode otomatis menyesuaikan perangkat atau dapat ditoggle secara manual.
*   **Animasi Performa Tinggi (60fps)**: Menggunakan Transform dan Opacity untuk Intersection Observer, Typing Effect, Staggered Text, Glitch, Hover state, dan Custom Cursor.
*   **Aksesibilitas & Reduced Motion**: Sistem menghargai preferensi perangkat pengguna (`prefers-reduced-motion`) dengan menonaktifkan animasi berat untuk kenyamanan mata.
*   **Responsif**: Optimal untuk layar ponsel (mulai 360px) hingga layar desktop besar (tidak ada gulir horizontal (overflow) ke samping).

---

## 🚀 Cara Menjalankan & Mem-build Tailwind CSS

Untuk mengoptimalkan pengiriman dan performa (Lighthouse score), Tailwind dikonfigurasi melalui CLI dan tidak lagi memuat CDN pada produksi.

1.  **Instalasi Dependencies (Opsional jika sudah ada node_modules):**
    Buka Terminal / Command Prompt di folder proyek ini (`c:\Users\Andika\Music\portfolio`), lalu jalankan:
    ```bash
    npm install
    ```

2.  **Mode Development (Live Watch):**
    Saat Anda sedang mengedit file HTML atau CSS, gunakan mode "Watch" ini. Tailwind akan me-rebuild file output setiap kali ada perubahan.
    ```bash
    npm run dev
    ```
    *Biarkan terminal tetap terbuka.* Buka `index.html` di browser menggunakan ekstensi seperti **Live Server** di VS Code.

3.  **Mode Production (Minify CSS):**
    Saat Anda siap untuk mempublikasikan website (deploy ke GitHub Pages), jalankan perintah ini untuk memperkecil ukuran (minify) CSS:
    ```bash
    npm run build
    ```

---

## 🖼️ Cara Mengompres Gambar (Sesuai Permintaan)

Anda memiliki script khusus berbasis NodeJS (`sharp`) untuk mengecilkan foto di folder penelitian TDSM menjadi format WebP dengan lebar maksimal 1200px dan ukuran ~250KB.

Pastikan semua gambar sudah ada di folder `image/penelitian_tdsm/`, lalu jalankan:
```bash
npm run compress
```
*(Script ini akan mengompres file, menyimpannya sebagai `.webp`, dan mencadangkan file aslinya)*.

---

## 📝 Lokasi Mengganti Teks Placeholder Proyek

Anda diminta untuk mengganti teks "Placeholder" pada 4 proyek di bagian "Proyek". Untuk melakukannya:

1.  Buka file `index.html`.
2.  Gunakan fitur **Search/Cari (Ctrl + F)**.
3.  Ketik kata kunci: `[Placeholder:`
4.  Anda akan diarahkan ke bagian deskripsi proyek (baris sekitar 300+ tergantung editor). Teks yang harus diganti berada di dalam tag `<p class="font-body text-sm opacity-80 mb-4 h-20 overflow-y-auto no-scrollbar">`.
    *   Proyek 2: E-Warkas
    *   Proyek 3: FAMS
    *   Proyek 4: Apotek Berkat
    *   Proyek 5: Undangan Khitan

Setelah teks diganti, simpan HTML (pastikan Anda menjalankan perintah `npm run dev` jika ada penambahan class Tailwind baru, meski jika hanya mengganti teks tidak perlu re-build CSS).
