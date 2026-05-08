# Project Name: Hari Ini Masak Apa (Recipe Generator AI)
# Architecture: Decoupled (Frontend: React.js | Backend: Express.js)

## 1. PROJECT VISION & CORE LOGIC
- **Goal:** Membantu pengguna menemukan resep masakan kreatif berdasarkan bahan sisa yang ada di kulkas mereka menggunakan AI (Gemini 2.5 Flash).
- **Target Audience:** Ibu rumah tangga, anak kos, dan pemula yang ingin memasak secara ekonomis.
- **Tone:** Ramah, informatif, dan "lokal" (Bahasa Indonesia).

## 2. TECH STACK SPECIFICATIONS
### Backend (express.js)
- **Runtime:** Node.js
- **Middleware:** cors, helmet, express.json().
- **AI Integration:** Google Gemini SDK (v1/v2).
- **Features:** REST API untuk menerima daftar bahan, generate resep, dan caching sederhana 
- **Structure** Gunakan MVC pada backend dengan metode controller, model, dan route
(opsional).

### Frontend (react.js)
- **Build Tool:** Vite (untuk kecepatan development).
- **Styling:** Tailwind CSS (Mobile-first).
- **Routing:** react-router-dom (Latest Version).
- **State Management:** React Hooks (useState, useEffect) atau Context API jika diperlukan.
- **Icons:** Lucide React.
- **Components:** Minimalis, bersih, dengan loading state yang interaktif (animasi masak).
- **Requirement:** Semua manajemen route HARUS dipusatkan di `main.jsx` menggunakan `BrowserRouter`, `Routes`, dan `Route`.

## 3. DEVELOPMENT PHASES (STEP-BY-STEP)

### PHASE 1: INITIALIZATION
1. inisiasi kebutuhan frontend pada folder /frontend dengan menggunakan command "npm create vite@latest" dengan menggunakan javascript untuk frontendnya untuk kebutuhan react vite
2. Setup Tailwind CSS di folder frontend menggunakan metode vite dengan command "npm install tailwindcss @tailwindcss/vite" dengan versi tailwind terbaru
3. Konfigurasi Proxy di frontend agar bisa berkomunikasi dengan backend (Port 5000).
4. Gunakan repo ini https://github.com/kokoy13/all-in-laundry sebagai referensi struktur project

### PHASE 2: BACKEND API DEVELOPMENT
1. Buat endpoint `POST /api/generate-recipe`.
2. Integrasikan API Key Gemini.
3. **Prompt Engineering:** Instruksikan AI untuk:
   - Menerima array bahan makanan.
   - Memberikan output JSON (Nama Resep, Waktu, Kesulitan, Bahan Tambahan, Langkah-langkah, Tips).
   - Pastikan resep logis dan aman dikonsumsi.

### PHASE 3: ROUTING DEVELOPMENT
1. Install `react-router-dom`.
2. Setup `App.jsx` sebagai Router Center. Struktur rute minimal:
   - `/` : Landing Page (Input bahan).
   - `/resep/:id` : Detail Resep (Hasil generate AI).
   - `/about` : Halaman informasi (Penting untuk syarat AdSense).
3. Buat folder `src/pages` untuk memisahkan logika tiap halaman, namun panggil semuanya di `App.jsx`.

### PHASE 4: FRONTEND UI DEVELOPMENT
1. **Landing Page:** Satu input bar besar untuk memasukkan bahan (pisahkan dengan koma).
2. **Recipe Card:** Tampilan hasil resep yang rapi. Gunakan card dengan transisi halus.
3. **Responsive Design:** Pastikan navigasi nyaman di HP (layar sentuh).

### PHASE 5: SEO & ADSENSE OPTIMIZATION
1. **Meta Tags:** Gunakan `react-helmet` atau sejenisnya untuk dinamis title dan description.
2. **AdSense Slots:** - Buat komponen `<AdSlot />` untuk menaruh iklan.
   - Slot 1: Di bawah input pencarian.
   - Slot 2: Di tengah-tengah langkah instruksi memasak.
   - Slot 3: Sticky bottom banner.
3. **Semantic HTML:** Gunakan tag `<article>`, `<section>`, dan `<h1>-<h3>` dengan benar untuk crawler Google.

## 4. MCP (MODEL CONTEXT PROTOCOL) USAGE
Gunakan MCP Tools jika tersedia di VS Code untuk:
- **@google-search:** Mencari resep yang sedang viral di Indonesia sebagai inspirasi default.
- **@terminal:** Menjalankan script deployment otomatis ke server.
- **@filesystem:** Menulis dokumentasi API secara otomatis.

## 5. SECURITY & PERFORMANCE RULES
- Simpan API Key di file `.env` (Jangan pernah push ke Git).
- Gunakan Rate Limiting di Express untuk mencegah penyalahgunaan API Key oleh bot.
- Optimize image/assets agar PageSpeed Score tetap tinggi (AdSense menyukai web cepat).

## 6. ERROR HANDLING
- Berikan pesan error yang manusiawi jika bahan yang dimasukkan user terlalu aneh (misal: "batu dan kayu").
- Tampilkan tombol "Coba Lagi" jika API AI sedang timeout.