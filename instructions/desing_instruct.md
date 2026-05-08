# Visual Identity: Hari Ini Masak Apa (Modern Food-Tech UI)
# References: Behance Modern Minimalist, Dribbble Clean Tech UI

## 1. COLOR PALETTE (Modern & Fresh)
- **Primary (Action):** `#FF6B35` (Clementine Orange) - Memberikan kesan lapar dan semangat.
- **Secondary (Nature):** `#2F9E44` (Fresh Leaf Green) - Kesan bahan makanan sehat/segar.
- **Background:** `#F8F9FA` (Soft Gray) - Biar mata nggak cepat lelah, beda dengan putih polos yang membosankan.
- **Surface:** `#FFFFFF` (Pure White) - Untuk card dan modul.
- **Text:** `#212529` (Deep Charcoal) - Untuk keterbacaan maksimal.

## 2. TYPOGRAPHY
- **Headings:** Gunakan Font Sans-Serif yang "Bold" dan "Rounded" (seperti 'Plus Jakarta Sans' atau 'Inter').
- **Body:** Gunakan 'Inter' atau 'Geist' dengan line-height 1.6 untuk kenyamanan membaca resep.
- **Emphasis:** Gunakan font-weight `600` untuk nama bahan makanan.

## 3. UI COMPONENTS STYLE (The "Dribbble" Look)
- **Cards:** - Border-radius: `24px` (Large rounding).
  - Shadow: `shadow-sm` saat diam, `shadow-xl` saat hover (Smooth Transition).
  - Border: `1px solid rgba(0,0,0,0.05)` untuk kesan premium "Glassmorphism" tipis.
- **Inputs:** - Input search harus besar, floating shadow, dengan icon Lucide di dalamnya.
  - Focus state: Ring color primary dengan efek glow.
- **Buttons:** - Pill-shaped (Full rounded).
  - Scale effect: `active:scale-95 transition-all`.

## 4. LAYOUT & SPACING
- **Spacing:** Gunakan sistem spacing 8pt (Tailwind: p-2, p-4, p-8).
- **Empty States:** Jika belum ada input, tampilkan ilustrasi makanan yang minimalis atau animasi lottie "panci masak".
- **Glassmorphism:** Navbar harus `backdrop-blur-md` dengan background semi-transparan.

## 5. ANIMATION GUIDELINES (Framer Motion / Tailwind Animate)
- **Loading:** Gunakan "Skeleton Screen" yang berdenyut (pulse) saat AI sedang berpikir, jangan cuma spinner putar.
- **Transitions:** Fade-in-up saat resep muncul agar terasa organik.
- **Micro-interactions:** Checklist bahan yang bisa dicoret (strikethrough) saat sudah disiapkan.

## 6. ADSENSE INTEGRATION (Seamless Design)
- **Ad Borders:** Pastikan slot iklan memiliki padding yang cukup agar tidak menempel ke konten resep.
- **Labeling:** Tambahkan label kecil "Sponsor" atau "Rekomendasi" di atas slot iklan dengan font size `10px` agar tetap rapi.