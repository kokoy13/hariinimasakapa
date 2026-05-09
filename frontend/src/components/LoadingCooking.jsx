import { useState, useEffect } from 'react'

const COOKING_TIPS = [
  "Tahukah kamu? Menambah garam ke air mendidih membuatnya lebih cepat panas.",
  "Koki kami sedang memilihkan bumbu terbaik untukmu...",
  "Tips: Simpan bumbu kering di tempat kering dan sejuk agar awet.",
  "Fakta: Telur yang segar akan tenggelam saat dimasukkan ke air.",
  "Rahasia dapur: Tambahkan sedikit gula saat menumis bawang agar tidak gosong.",
  "Kami sedang menghitung takaran bumbu yang sempurna...",
  "Tips: Gunakan pisau tajam untuk memotong bahan agar hasilnya lebih rapi.",
  "Fakta: Memasak dengan api kecil membuat makanan lebih meresap bumbu.",
  "Koki sedang mencari inspirasi resep terbaik untuk bahan kamu...",
  "Tips: Cuci bahan sayuran sebelum dipotong untuk menjaga nutrisinya."
]

export default function LoadingCooking({ text = 'Sedang menyiapkan resep dari bahan kamu…' }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % COOKING_TIPS.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-700">{text}</p>
        <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-xs font-medium text-[#FF6B35]">
          AI
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#FF6B35]/5 to-[#2F9E44]/5 p-3 border border-black/2">
        <p className="text-xs text-zinc-600 leading-relaxed animate-fade-in">
          💡 {COOKING_TIPS[currentTipIndex]}
        </p>
      </div>

      <div className="mt-4 space-y-2" aria-hidden="true">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-zinc-100" />
      </div>
    </div>
  )
}

