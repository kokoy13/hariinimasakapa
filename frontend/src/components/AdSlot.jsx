export default function AdSlot({ label = 'Iklan', className = '' }) {
  return (
    <section
      aria-label={label}
      className={`rounded-3xl border border-black/5 bg-white p-4 shadow-sm transition-shadow hover:shadow-xl ${className}`}
    >
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        Sponsor
      </p>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="text-xs text-zinc-500">AdSense Slot Placeholder</span>
      </div>
    </section>
  )
}

