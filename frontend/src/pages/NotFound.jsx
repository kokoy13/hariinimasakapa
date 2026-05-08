import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Hari Ini Masak Apa</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Halaman tidak ada</h1>
        <p className="text-zinc-600">
          Link-nya mungkin salah atau halamannya sudah dipindah.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Kembali ke Home
        </Link>
      </section>
    </>
  )
}

