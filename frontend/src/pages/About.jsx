import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — Hari Ini Masak Apa</title>
        <meta
          name="description"
          content="Informasi tentang Hari Ini Masak Apa, cara kerja, dan catatan penting untuk pengguna."
        />
      </Helmet>

      <article className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tentang situs ini
          </h1>
          <p className="text-zinc-600">
            <strong>Hari Ini Masak Apa</strong> membantu kamu menemukan ide resep
            dari bahan yang sudah ada di rumah, supaya masak jadi lebih hemat dan
            nggak bingung.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-2 text-base font-semibold">Cara kerja</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>Kamu masukkan daftar bahan (pisahkan dengan koma).</li>
            <li>
              Sistem akan membuat 1 resep yang logis: bahan, langkah, dan tips.
            </li>
            <li>
              Hasil dibuat otomatis, jadi mohon cek kembali sebelum memasak.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-2 text-base font-semibold">Catatan penting</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700">
            <li>
              Perhatikan alergi, tingkat kematangan makanan, dan kebersihan
              bahan.
            </li>
            <li>
              Jika resep terasa aneh, kamu bisa klik “Coba Lagi” untuk
              mendapatkan versi lain.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-2 text-base font-semibold">Kontak</h2>
          <p className="text-sm text-zinc-700">
            Jika ada masukan atau permintaan fitur, kamu bisa menambahkan kontak
            admin di sini (email/WA) sesuai kebutuhan.
          </p>
        </section>
      </article>
    </>
  )
}

