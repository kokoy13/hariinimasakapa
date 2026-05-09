import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { History, Search, Sparkles } from 'lucide-react'
import AdSlot from '../components/AdSlot.jsx'
import LoadingCooking from '../components/LoadingCooking.jsx'
import RecipeSkeleton from '../components/RecipeSkeleton.jsx'
import { postJson } from '../utils/api.js'
import { backupRecipes } from '../data/backupRecipes.js'
import { postSse } from '../utils/sse.js'

const STOPWORDS = new Set([
  'dan',
  'dengan',
  'yg',
  'yang',
  'atau',
  'serta',
  'di',
  'ke',
  'dari',
])

function sanitizeIngredients(input) {
  const raw = input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 25)

  const cleaned = raw
    .map((s) =>
      s
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .map((s) => s.split(' ').filter((w) => w && !STOPWORDS.has(w)).join(' '))
    .map((s) => s.trim())
    .filter(Boolean)

  const seen = new Set()
  const deduped = []
  for (const item of cleaned) {
    const key = item.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(item)
  }

  return deduped.slice(0, 25)
}

function loadRecentRecipes() {
  try {
    const raw = localStorage.getItem('recentRecipes')
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRecentRecipe({ id, recipe }) {
  const next = [
    { id, recipe, createdAt: Date.now() },
    ...loadRecentRecipes().filter((x) => x?.id !== id),
  ].slice(0, 5)
  localStorage.setItem('recentRecipes', JSON.stringify(next))
  localStorage.setItem(`recipe:${id}`, JSON.stringify(recipe))
}

export default function Landing() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [force, setForce] = useState(false)
  const [quotaFallback, setQuotaFallback] = useState(false)
  const [recent, setRecent] = useState(() => loadRecentRecipes())
  const [streamText, setStreamText] = useState('')
  const [earlyRecipeName, setEarlyRecipeName] = useState('')
  const navigate = useNavigate()

  const ingredients = useMemo(() => sanitizeIngredients(input), [input])

  useEffect(() => {
    setRecent(loadRecentRecipes())
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setQuotaFallback(false)
    setStreamText('')
    setEarlyRecipeName('')

    if (ingredients.length < 2 && !force) {
      setError('Minimal 2 bahan dulu ya. Kalau mau, centang "Tetap kirim".')
      return
    }

    setLoading(true)
    try {
      let done = null
      await postSse(
        '/api/generate-recipe/stream',
        { ingredients },
        {
          delta: (p) => {
            const text = p?.text || ''
            // Check for early recipe name markers
            if (text.includes('[RECIPE_NAME_START]') && text.includes('[RECIPE_NAME_END]')) {
              const recipeName = text.replace(/\[RECIPE_NAME_START\]|\[RECIPE_NAME_END\]/g, '').trim()
              if (recipeName) {
                setEarlyRecipeName(recipeName)
              }
            } else {
              setStreamText((t) => t + text)
            }
          },
          done: (p) => {
            done = p
          },
          error: (p) => {
            const err = new Error(p?.message || 'Terjadi kesalahan. Coba lagi ya.')
            err.status = p?.status
            throw err
          },
        },
      )

      const id = done?.id
      const recipe = done?.recipe
      if (!id || !recipe) throw new Error('Resep gagal dibuat. Coba lagi ya.')

      saveRecentRecipe({ id, recipe })
      setRecent(loadRecentRecipes())
      navigate(`/resep/${id}`, { state: { recipe } })
    } catch (err) {
      // fallback to non-streaming if streaming fails for non-quota reasons
      if (!err?.status && !quotaFallback) {
        try {
          const data = await postJson('/api/generate-recipe', { ingredients })
          const id = data?.id
          const recipe = data?.recipe
          if (id && recipe) {
            saveRecentRecipe({ id, recipe })
            setRecent(loadRecentRecipes())
            navigate(`/resep/${id}`, { state: { recipe } })
            return
          }
        } catch (_) {
          // ignore and surface original err below
        }
      }
      if (err?.status === 429) {
        setQuotaFallback(true)
        setError(
          'Wah, koki kami sedang belanja bahan sebentar! Coba resep populer yang sudah tersedia di bawah ini ya.',
        )
      } else {
        setError(err?.message || 'Terjadi kesalahan. Coba lagi ya.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Hari Ini Masak Apa — Generator Resep AI</title>
        <meta
          name="description"
          content="Cara masak enak tanpa ribet dan tanpa mahal untuk anak kos & pemula."
        />
      </Helmet>

      <section className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Masak hemat dari bahan yang ada
          </h1>
          <p className="text-pretty text-zinc-600">
            Tulis bahan yang kamu punya, pisahkan dengan koma. Nanti aku bikinin
            resep yang masuk akal dan enak.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <span className="sr-only">Bahan</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Contoh: telur, nasi, sawi, bawang putih"
                className="w-full rounded-3xl border border-black/5 bg-white py-4 pl-12 pr-4 text-base shadow-sm outline-none placeholder:text-zinc-400 transition-all focus-visible:border-[#FF6B35] focus-visible:ring-4 focus-visible:ring-[#FF6B35]/25 focus-visible:shadow-xl"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading || ingredients.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF6B35] px-4 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:shadow-xl hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-5 w-5" />
            Buat Resep
          </button>

          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-[#FF6B35] accent-[#FF6B35]"
            />
            Tetap kirim walau bahan kurang dari 2
          </label>

          <p className="text-sm text-zinc-600">
            Terbaca: <span className="font-medium">{ingredients.length}</span>{' '}
            bahan
          </p>
        </form>

        <AdSlot label="Slot Iklan — di bawah input" />

        {loading ? (
          <div className="space-y-4">
            <LoadingCooking text="Sedang menyiapkan resep dari bahan kamu…" />
            {earlyRecipeName ? (
              <section className="rounded-3xl border border-black/5 bg-gradient-to-r from-[#FF6B35]/5 to-[#2F9E44]/5 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-[#FF6B35] animate-pulse"></div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                    Resep kamu siap!
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 mb-1">
                  {earlyRecipeName}
                </h3>
                <p className="text-xs text-zinc-600">Sedang melengkapkan detail resep...</p>
              </section>
            ) : null}
            <RecipeSkeleton />
            
            {/* Pre-computed suggestions while waiting */}
            <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#2F9E44]/10 flex items-center justify-center">
                  <span className="text-xs">💡</span>
                </div>
                <h2 className="text-base font-semibold">Mungkin Kamu Suka</h2>
              </div>
              <p className="text-xs text-zinc-600 mb-3">Resep populer yang bisa dicoba sambil menunggu:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {backupRecipes
                  .filter((r) => r.kesulitan === 'mudah')
                  .slice(0, 4)
                  .map((r) => (
                    <button
                      key={`suggest-${r.id}`}
                      type="button"
                      onClick={() => {
                        localStorage.setItem(`recipe:${r.id}`, JSON.stringify(r))
                        navigate(`/resep/${r.id}`, { state: { recipe: r } })
                      }}
                      className="rounded-2xl border border-black/5 bg-zinc-50 p-3 text-left transition-all hover:bg-white hover:shadow-sm active:scale-[0.99]"
                    >
                      <p className="text-xs font-semibold">{r.namaResep}</p>
                      <p className="mt-1 text-[10px] text-zinc-600">
                        {r.waktuMasakMenit} menit • {r.kesulitan}
                      </p>
                    </button>
                  ))}
              </div>
            </section>
            
            {streamText ? (
              <section className="rounded-3xl border border-black/5 bg-white p-4 text-sm text-zinc-700 shadow-sm">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                  Sedang mengetik…
                </p>
                <pre className="max-h-52 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed">
                  {streamText}
                </pre>
              </section>
            ) : null}
          </div>
        ) : null}

        {!loading && ingredients.length === 0 ? (
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F9E44]/10 text-[#2F9E44]">
                <span className="text-2xl" aria-hidden="true">
                  🍲
                </span>
              </div>
              <h2 className="text-base font-semibold">Mulai dari bahan di kulkas</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Kamu bisa tulis 3–6 bahan dulu. Nanti aku bantu susun resepnya.
              </p>
            </div>
          </section>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && recent.length > 0 ? (
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <div className="mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-zinc-700" />
              <h2 className="text-base font-semibold">5 resep terakhir</h2>
            </div>
            <ul className="space-y-2">
              {recent.map((x) => (
                <li key={x.id}>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/resep/${x.id}`, { state: { recipe: x.recipe } })
                    }
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/5 bg-zinc-50 px-4 py-3 text-left transition-all hover:bg-white hover:shadow-sm active:scale-[0.99]"
                  >
                    <span className="font-semibold">
                      {x?.recipe?.namaResep || 'Resep'}
                    </span>
                    <span className="text-xs text-zinc-500">Lihat</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!loading && quotaFallback ? (
          <section className="space-y-3">
            <h2 className="text-base font-semibold">Resep populer (backup)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {backupRecipes.slice(0, 10).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    localStorage.setItem(`recipe:${r.id}`, JSON.stringify(r))
                    navigate(`/resep/${r.id}`, { state: { recipe: r } })
                  }}
                  className="rounded-3xl border border-black/5 bg-white p-4 text-left shadow-sm transition-all hover:shadow-xl active:scale-[0.99]"
                >
                  <p className="text-sm font-semibold">{r.namaResep}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {r.waktuMasakMenit} menit • {r.kesulitan}
                  </p>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3 pt-2">
          <h2 className="text-base font-semibold">Resep Rp 10rb</h2>
          <p className="text-sm text-zinc-600">
            Ide menu murah meriah yang realistis untuk anak kos & pemula.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {backupRecipes
              .filter((r) => r.kesulitan === 'mudah' || r.kesulitan === 'sedang')
              .slice(0, 6)
              .map((r) => (
                <button
                  key={`10k-${r.id}`}
                  type="button"
                  onClick={() => {
                    localStorage.setItem(`recipe:${r.id}`, JSON.stringify(r))
                    navigate(`/resep/${r.id}`, { state: { recipe: r } })
                  }}
                  className="rounded-3xl border border-black/5 bg-white p-4 text-left shadow-sm transition-all hover:shadow-xl active:scale-[0.99]"
                >
                  <p className="text-sm font-semibold">{r.namaResep}</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {r.waktuMasakMenit} menit • {r.kesulitan} • Pemula
                  </p>
                </button>
              ))}
          </div>
        </section>
      </section>
    </>
  )
}

