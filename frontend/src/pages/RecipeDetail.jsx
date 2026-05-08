import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  CookingPot,
  Flame,
  ListChecks,
  RefreshCcw,
  Wallet,
} from 'lucide-react'
import AdSlot from '../components/AdSlot.jsx'
import LoadingCooking from '../components/LoadingCooking.jsx'
import RecipeHero from '../components/RecipeHero.jsx'
import { getJson } from '../utils/api.js'

function difficultyLabel(value) {
  const v = String(value || '').toLowerCase()
  if (v === 'mudah') return 'Mudah'
  if (v === 'sedang') return 'Sedang'
  if (v === 'sulit') return 'Sulit'
  return '—'
}

function costLabel(value) {
  const v = String(value || '').trim()
  if (v === '$') return 'Murah'
  if (v === '$$') return 'Sedang'
  if (v === '$$$') return 'Agak mahal'
  return '—'
}

export default function RecipeDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [recipe, setRecipe] = useState(() => location?.state?.recipe || null)
  const [loading, setLoading] = useState(!recipe)
  const [error, setError] = useState('')
  const [checked, setChecked] = useState({})

  const title = useMemo(
    () => recipe?.namaResep || recipe?.nama_resep || 'Detail Resep',
    [recipe?.namaResep, recipe?.nama_resep],
  )

  async function load() {
    setError('')
    setLoading(true)
    try {
      const cached =
        sessionStorage.getItem(`recipe:${id}`) ||
        localStorage.getItem(`recipe:${id}`)
      if (cached) {
        setRecipe(JSON.parse(cached))
        return
      }
      const data = await getJson(`/api/recipe/${id}`)
      setRecipe(data?.recipe || null)
      if (data?.recipe) {
        sessionStorage.setItem(`recipe:${id}`, JSON.stringify(data.recipe))
        localStorage.setItem(`recipe:${id}`, JSON.stringify(data.recipe))
      }
    } catch (err) {
      setError(err?.message || 'Gagal memuat resep. Coba lagi ya.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!recipe) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    setChecked({})
  }, [id, recipe?.namaResep])

  if (loading) {
    return <LoadingCooking text="Memuat resep…" />
  }

  if (error) {
    return (
      <section className="space-y-3">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-xl hover:brightness-95 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Coba Lagi
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:shadow-xl active:scale-95"
          >
            Kembali
          </Link>
        </div>
      </section>
    )
  }

  if (!recipe) {
    return (
      <section className="space-y-3">
        <p className="text-zinc-700">Resep tidak ditemukan.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-xl hover:brightness-95 active:scale-95"
        >
          Kembali ke pencarian
        </Link>
      </section>
    )
  }

  const langkah = Array.isArray(recipe.langkah) ? recipe.langkah : []
  const midIndex = Math.max(1, Math.floor(langkah.length / 2))

  const cost = recipe.costIndicator || recipe.indikator_biaya
  const skill = recipe.skillLevel || recipe.level_skill || 'Pemula'
  const mainIngredients = recipe.bahanUtama || recipe.bahan_utama || []
  const extraIngredients = recipe.bahanTambahan || []
  const allIngredientKeys = [
    ...mainIngredients.map((b) => `utama:${b}`),
    ...extraIngredients.map((b) => `tambah:${b}`),
  ]
  const allChecked =
    allIngredientKeys.length > 0 && allIngredientKeys.every((k) => checked[k])

  return (
    <>
      <Helmet>
        <title>{title} — Hari Ini Masak Apa</title>
        <meta
          name="description"
          content={
            recipe?.funFact
              ? `${title} — ${recipe.funFact}`
              : `Resep ${title} dari generator AI. Lengkap dengan bahan, langkah, dan tips.`
          }
        />
      </Helmet>

      <article className="space-y-5 pb-20">
        <header className="space-y-3">
          <p className="text-sm text-zinc-500">
            <Link className="hover:underline" to="/">
              Home
            </Link>{' '}
            / Resep
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl drop-shadow-sm">
            {recipe.namaResep || recipe.nama_resep}
          </h1>

          <div className="pt-1">
            <RecipeHero title={recipe.namaResep || recipe.nama_resep} />
          </div>

          <section className="grid gap-2 sm:grid-cols-4">
            <div className="flex items-center gap-2 rounded-3xl border border-black/5 bg-white px-3 py-2 text-sm shadow-sm transition-shadow hover:shadow-xl">
              <Clock3 className="h-4 w-4 text-zinc-700" />
              <span className="text-zinc-600">Waktu</span>
              <span className="ml-auto font-medium">
                {recipe.waktuMasakMenit || recipe.estimasi_waktu
                  ? `${recipe.waktuMasakMenit || recipe.estimasi_waktu} menit`
                  : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-black/5 bg-white px-3 py-2 text-sm shadow-sm transition-shadow hover:shadow-xl">
              <Flame className="h-4 w-4 text-zinc-700" />
              <span className="text-zinc-600">Kesulitan</span>
              <span className="ml-auto font-medium">
                {difficultyLabel(recipe.kesulitan)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-black/5 bg-white px-3 py-2 text-sm shadow-sm transition-shadow hover:shadow-xl">
              <Wallet className="h-4 w-4 text-zinc-700" />
              <span className="text-zinc-600">Biaya</span>
              <span className="ml-auto font-medium">
                {cost ? `${cost} (${costLabel(cost)})` : '—'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-3xl border border-black/5 bg-white px-3 py-2 text-sm shadow-sm transition-shadow hover:shadow-xl">
              <ListChecks className="h-4 w-4 text-zinc-700" />
              <span className="text-zinc-600">{skill}</span>
              <span className="ml-auto font-medium">{langkah.length}</span>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#langkah"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-xl hover:brightness-95 active:scale-95"
            >
              <CookingPot className="h-4 w-4" />
              Masak Sekarang
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition-all hover:shadow-xl active:scale-95"
            >
              Cari bahan lain
            </Link>
          </div>

          {allChecked ? (
            <section className="flex items-center gap-2 rounded-3xl border border-[#2F9E44]/20 bg-[#2F9E44]/10 px-4 py-3 text-sm text-[#2F9E44]">
              <CheckCircle2 className="h-5 w-5" />
              Mantap! Semua bahan sudah siap. Tinggal eksekusi langkahnya.
            </section>
          ) : null}
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">Bahan utama</h2>
            <ul className="space-y-2 text-sm text-zinc-700">
              {mainIngredients.map((b, idx) => {
                const key = `utama:${b}`
                const isOn = Boolean(checked[key])
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() =>
                        setChecked((s) => ({ ...s, [key]: !s[key] }))
                      }
                      className="group flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2 text-left transition-all hover:bg-white hover:shadow-sm active:scale-[0.99]"
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                          isOn
                            ? 'border-[#2F9E44] bg-[#2F9E44]/10'
                            : 'border-zinc-300 bg-white'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`font-semibold ${
                          isOn ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {b}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">Bahan tambahan</h2>
            <ul className="space-y-2 text-sm text-zinc-700">
              {extraIngredients.map((b, idx) => {
                const key = `tambah:${b}`
                const isOn = Boolean(checked[key])
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() =>
                        setChecked((s) => ({ ...s, [key]: !s[key] }))
                      }
                      className="group flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2 text-left transition-all hover:bg-white hover:shadow-sm active:scale-[0.99]"
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded-full border-2 ${
                          isOn
                            ? 'border-[#2F9E44] bg-[#2F9E44]/10'
                            : 'border-zinc-300 bg-white'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`font-semibold ${
                          isOn ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {b}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </section>

        <AdSlot label="Slot Iklan — space antara bahan & langkah" />

        <section
          id="langkah"
          className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
        >
          <h2 className="mb-3 text-base font-semibold">Langkah memasak</h2>
          <div className="mb-3 flex items-center gap-2 text-xs text-zinc-600">
            <CookingPot className="h-4 w-4" />
            <span>Langkah ringkas, gaya pemula, minim ribet.</span>
          </div>
          <ol className="space-y-2 text-sm text-zinc-700">
            {langkah.slice(0, midIndex).map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>

          <AdSlot className="my-4" label="Slot Iklan — di tengah langkah" />

          <ol
            start={midIndex + 1}
            className="space-y-2 text-sm text-zinc-700"
          >
            {langkah.slice(midIndex).map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-semibold text-white">
                  {midIndex + idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
          <h2 className="mb-2 text-base font-semibold">Tips</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {(recipe.tips || []).map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </section>

        {recipe?.tipsHemat ? (
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">Tips hemat</h2>
            <p className="text-sm text-zinc-700">{recipe.tipsHemat}</p>
          </section>
        ) : null}

        {recipe?.funFact ? (
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">Fun fact</h2>
            <p className="text-sm text-zinc-700">{recipe.funFact}</p>
          </section>
        ) : null}

        {recipe?.bumbuSubstitusi &&
        typeof recipe.bumbuSubstitusi === 'object' &&
        Object.keys(recipe.bumbuSubstitusi).length > 0 ? (
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">Bumbu substitusi</h2>
            <ul className="space-y-2 text-sm text-zinc-700">
              {Object.entries(recipe.bumbuSubstitusi).map(([k, v]) => (
                <li
                  key={k}
                  className="rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2"
                >
                  <span className="font-semibold">{k}</span>{' '}
                  <span className="text-zinc-500">→</span> {String(v)}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {recipe?.versiMurah &&
        typeof recipe.versiMurah === 'object' &&
        (recipe.versiMurah.judul || Object.keys(recipe.versiMurah.ganti_bahan || {}).length > 0) ? (
          <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl">
            <h2 className="mb-2 text-base font-semibold">
              Versi murah{recipe.versiMurah.judul ? ` — ${recipe.versiMurah.judul}` : ''}
            </h2>
            {Object.keys(recipe.versiMurah.ganti_bahan || {}).length > 0 ? (
              <ul className="space-y-2 text-sm text-zinc-700">
                {Object.entries(recipe.versiMurah.ganti_bahan).map(([k, v]) => (
                  <li
                    key={k}
                    className="rounded-2xl border border-black/5 bg-zinc-50 px-3 py-2"
                  >
                    <span className="font-semibold">{k}</span>{' '}
                    <span className="text-zinc-500">→</span> {String(v)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-700">
                Bahanmu sudah tergolong hemat. Kamu aman lanjut masak versi ini.
              </p>
            )}
          </section>
        ) : null}
      </article>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <AdSlot label="Slot Iklan — sticky bottom banner" />
        </div>
      </div>
    </>
  )
}

