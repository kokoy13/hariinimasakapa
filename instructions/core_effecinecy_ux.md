# Focus: High-Efficiency UX & Token Management
# Goal: Maximum value per single API request

## 1. SMART FRONTEND FILTERING (Zero-Token Logic)
- **Input Validation:** Copilot HARUS membuat fungsi sanitasi di React sebelum data dikirim ke Backend. 
  - Hapus kata sambung tidak berguna (dan, dengan, yg).
  - Cegah pengiriman jika bahan < 2 (Kecuali user memaksa).
  - Cek duplikasi bahan secara lokal.
- **Client-Side State:** Gunakan `localStorage` untuk menyimpan 5 resep terakhir. Jangan panggil API jika user hanya ingin melihat resep yang baru saja mereka generate.

## 2. THE "ALL-IN-ONE" PROMPT ARCHITECTURE
Saat menyusun pemanggilan API ke Gemini, gunakan instruksi sistem berikut agar satu response menghasilkan banyak fitur UX:

- **Strict JSON Output:** Paksa AI memberikan output dalam format JSON yang mencakup:
  1. `nama_resep`: String (Catchy & Lokal).
  2. `estimasi_waktu`: Menit.
  3. `bahan_utama`: Array of strings.
  4. `bumbu_substitusi`: Object (Kunci: Nama Bumbu, Nilai: Alternatif jika tidak ada). **[UX Value: Penyelamat Masak]**
  5. `langkah_masak`: Array of strings (Maksimal 2 kalimat per langkah).
  6. `tips_hemat`: String (Tips cara menghemat gas atau bahan).
  7. `fun_fact`: String singkat tentang masakan tersebut.

## 3. STREAMING UX (Perception of Speed)
- **Implementation:** Gunakan Server-Sent Events (SSE) atau Streaming Response dari Gemini.
- **UX Goal:** Jangan biarkan user melihat spinner loading kosong. Tampilkan teks resep secara bertahap (typing effect) agar user merasa prosesnya instan meskipun kuota tier gratis terkadang agak lambat.

## 4. QUOTA FAILSAFE (The "Empty Tank" Plan)
- **Error Handling:** Jika API mengembalikan status 429 (Too Many Requests/Limit Reached):
  - **JANGAN** tampilkan pesan "API Error".
  - **TAMPILKAN:** "Wah, koki kami sedang belanja bahan sebentar! Coba resep populer yang sudah tersedia di bawah ini ya."
  - **Static Backup:** Siapkan 10 resep JSON statis di folder `src/data` sebagai cadangan jika kuota 40/day habis.

## 5. REVENUE-READY STRUCTURE (AdSense Prep)
- **Layout Consistency:** Berikan space kosong (skeleton) untuk iklan di antara 'Bahan' dan 'Langkah Masak'. 
- **SEO Optimization:** Gunakan data dari JSON resep untuk mengisi Meta Tags secara dinamis agar halaman resep bisa terindeks Google tanpa harus memanggil API lagi.