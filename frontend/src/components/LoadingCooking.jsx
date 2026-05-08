export default function LoadingCooking({ text = 'Lagi masak…' }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-700">{text}</p>
        <span className="rounded-full bg-[#FF6B35]/10 px-3 py-1 text-xs font-medium text-[#FF6B35]">
          AI
        </span>
      </div>

      <div className="mt-4 space-y-2" aria-hidden="true">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-zinc-100" />
      </div>
    </div>
  )
}

