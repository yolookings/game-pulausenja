# Pulau Senja — Match-3 Adventure

Game match-3 ala Candy Crush dengan storyline petualangan di Pulau Senja. Kumpulkan permen cahaya, selesaikan 12 level, dan hidupkan kembali mercusuar sebelum malam abadi datang.

## Tentang game

**Genre:** Match-3 puzzle + cerita  
**Bahasa:** Indonesia  
**Platform:** Browser — tidak perlu instalasi

Gabungan mekanik Candy Crush (cocokkan 3+ permen) dengan narasi Pulau Senja yang berkembang di setiap level.

## Cara main

1. Buka `index.html` di browser
2. Klik **Mulai Petualangan** di intro
3. Baca cerita, lalu mainkan level match-3
4. **Klik dua permen bersebelahan** untuk menukar — hanya swap yang membentuk match 3+ yang valid
5. Selesaikan **objektif** (kumpulkan warna tertentu atau capai skor) sebelum gerakan habis
6. Kumpulkan bintang (1–3) berdasarkan skor dan buka level berikutnya

```bash
open index.html
```

## Mekanik (seperti Candy Crush)

| Fitur | Deskripsi |
|-------|-----------|
| **Grid 8×8** | 6 jenis permen warna-warni |
| **Swap** | Hanya permen bersebelahan; swap invalid akan bergetar |
| **Match 3+** | Permen hilang, yang di atas jatuh, combo berturut |
| **Gerakan terbatas** | Setiap level punya jumlah gerakan |
| **Objektif** | Kumpulkan jenis permen atau capai skor target |
| **Bintang** | 1–3 bintang berdasarkan skor threshold |
| **Combo** | Match berantai = poin lebih besar |

## Storyline

12 level dibagi dalam 5 bab:

1. **Bab I — Pantai** (Level 1–3): Bangun di pantai, kumpulkan permen pertama, nyalakan mercusuar
2. **Bab II — Hutan** (Level 4–6): Hutan kabut, bayangan Penjaga
3. **Bab III — Gua** (Level 7–9): Teka-teki harapan, pecahan cahaya kedua
4. **Bab IV — Teluk** (Level 10–11): Roh air dan permen Amethyst
5. **Bab V — Puncak** (Level 12): Ujian akhir — semua warna + skor legendaris

**Akhir cerita** tergantung total bintang yang dikumpulkan di seluruh level.

## Progress tersimpan

Progress (level terbuka & bintang) disimpan otomatis di `localStorage` browser.

## Struktur file

```
game/
├── index.html   # UI: menu, peta, cerita, papan game
├── style.css    # Tema Candy Crush (warna cerah, permen glossy)
├── script.js    # Engine match-3, level, cerita
└── README.md
```

## Teknologi

HTML, CSS, dan JavaScript murni — tanpa framework atau build step.
