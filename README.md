# 📁 File Organizer

> Script Node.js untuk otomatis merapikan folder berdasarkan tipe file — zero dependencies.

![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-success)

---

## ✨ Apa yang dilakukan

Mengelompokkan file secara otomatis ke dalam subfolder berdasarkan tipenya:

```
Downloads/               Downloads/ (setelah dijalankan)
├── photo.jpg            ├── Images/
├── clip.mp4      →      │   └── photo.jpg
├── report.pdf           ├── Videos/
├── song.mp3             │   └── clip.mp4
├── archive.zip          ├── Documents/
└── script.js            │   └── report.pdf
                         ├── Audio/
                         │   └── song.mp3
                         ├── Archives/
                         │   └── archive.zip
                         └── Code/
                             └── script.js
```

---

## 🚀 Cara Pakai

### 1. Clone & jalankan

```bash
git clone https://github.com/usernamekamu/file-organizer.git
cd file-organizer
```

### 2. Simulasi dulu (aman, tidak ada file yang dipindah)

```bash
node organizer.js --dry-run
```

### 3. Jalankan sungguhan

```bash
# Rapikan folder ~/Downloads (default)
node organizer.js

# Rapikan folder tertentu
node organizer.js /path/ke/folder/kamu
node organizer.js C:\Users\Nama\Desktop
```

---

## 📂 Kategori File

| Folder | Ekstensi |
|--------|----------|
| `Images/` | jpg, jpeg, png, gif, webp, svg, bmp, ico, tiff, heic |
| `Videos/` | mp4, mov, mkv, avi, wmv, flv, webm |
| `Audio/` | mp3, wav, flac, aac, ogg, wma, m4a |
| `Documents/` | pdf, doc, docx, xls, xlsx, ppt, txt, csv, md |
| `Archives/` | zip, rar, 7z, tar, gz, bz2, iso |
| `Code/` | js, ts, py, java, html, css, php, go, json, sql |
| `Fonts/` | ttf, otf, woff, woff2 |
| `Ebooks/` | epub, mobi, azw |
| `Others/` | semua yang tidak dikenali |

> **Kustomisasi:** Edit file `config.js` untuk menambah kategori atau ekstensi baru.

---

## ⚙️ Fitur

- ✅ **Dry run mode** — simulasi dulu sebelum memindah file sungguhan
- ✅ **Anti-overwrite** — file dengan nama sama otomatis diberi nomor `(1)`, `(2)`, dst.
- ✅ **Skip hidden files** — file yang diawali `.` tidak disentuh
- ✅ **Custom folder** — bisa dipakai di folder mana pun, bukan cuma Downloads
- ✅ **Zero dependencies** — hanya butuh Node.js

---

## 🧪 Test

```bash
node tests/test.js
```

---

## 📁 Struktur Proyek

```
file-organizer/
├── organizer.js     # Script utama
├── config.js        # Konfigurasi kategori & ekstensi
├── tests/
│   └── test.js      # Test suite
├── package.json
└── README.md
```

---

## 📄 Lisensi

[MIT](https://choosealicense.com/licenses/mit/)
