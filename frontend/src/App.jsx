import { NavLink, Outlet } from 'react-router-dom'
import { ChefHat, Info } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-full bg-[#F8F9FA] text-[#212529]">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Lewati ke konten
      </a>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <ChefHat className="h-5 w-5 text-[#FF6B35]" />
            Hari Ini Masak Apa
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'bg-white text-zinc-700 shadow-sm hover:shadow-xl border border-black/5'
                }`
              }
            >
              <Info className="h-4 w-4" />
              About
            </NavLink>
          </div>
        </nav>
      </header>

      <main id="konten" className="mx-auto max-w-4xl px-4 py-6">
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-zinc-600">
          <p>
            © {new Date().getFullYear()} Hari Ini Masak Apa. Dibuat untuk membantu
            masak hemat dari bahan yang ada.
          </p>
        </div>
      </footer>
    </div>
  )
}
