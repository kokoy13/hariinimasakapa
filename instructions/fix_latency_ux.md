# Focus: Fixing UX Latency & Response Feedback
# Objective: Reduce perceived waiting time for Free Tier AI

## 1. DYNAMIC LOADING STATES (The "Distraction" Strategy)
- **Action:** Ganti spinner loading membosankan dengan teks yang berganti tiap 2 detik.
- **Content:** Tampilkan tips dapur atau fakta unik singkat, contoh:
  - "Tahukah kamu? Menambah garam ke air mendidih membuatnya lebih cepat panas."
  - "Koki kami sedang memilihkan bumbu terbaik untukmu..."
- **Goal:** Menjaga mata user tetap sibuk agar 5 detik tidak terasa lama.

## 2. STREAMING IMPLEMENTATION (Must Have)
- **Requirement:** Gunakan streaming response dari API Gemini.
- **Behavior:** Jangan tunggu JSON utuh selesai. Munculkan bagian `nama_resep` segera setelah tersedia di buffer pertama.
- **UX Goal:** User bisa mulai membaca judul resep dalam 1-2 detik pertama.

## 3. SKELETON UI & CARD PREPARATION
- **Visual:** Saat loading, tampilkan "bayangan" (skeleton) dari kartu resep, daftar bahan, dan langkah-langkah.
- **Effect:** Memberikan ilusi bahwa konten sudah "hampir sampai".

## 4. PRE-COMPUTED SUGGESTIONS
- **Logic:** Sambil menunggu API utama, tampilkan section "Mungkin Kamu Suka" di bawah area loading yang berisi data statis (bukan dari AI).