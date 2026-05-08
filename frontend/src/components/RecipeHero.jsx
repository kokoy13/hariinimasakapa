import { useMemo, useState } from 'react'
import { ImageOff, Sparkles } from 'lucide-react'
import { useStableConnection } from '../hooks/useStableConnection.js'

function buildUnsplashUrl(query) {
  const q = encodeURIComponent(query || 'indonesian food')
  // Source API: no key required, but results are not guaranteed.
  return `https://source.unsplash.com/featured/900x500/?${q}`
}

export default function RecipeHero({ title }) {
  const stable = useStableConnection()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const url = useMemo(() => buildUnsplashUrl(title), [title])

  if (!stable || failed) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF6B35]/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#2F9E44]/15 blur-2xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
            {stable ? <Sparkles className="h-5 w-5" /> : <ImageOff className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Ilustrasi ringan
            </p>
            <p className="mt-1 text-sm text-zinc-700">
              Mode hemat data aktif. Kami tidak memuat foto masakan.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-zinc-100">
        <img
          src={url}
          alt={title ? `Foto ${title}` : 'Foto masakan'}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-all duration-500 ${
            loaded ? 'blur-0' : 'blur-md scale-[1.03]'
          }`}
        />
        {!loaded ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-100 to-zinc-200" />
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
          Foto dinamis (Unsplash)
        </p>
        <a
          className="text-xs text-zinc-600 hover:underline"
          href="https://unsplash.com"
          target="_blank"
          rel="noreferrer"
        >
          Sumber: Unsplash
        </a>
      </div>
    </section>
  )
}

