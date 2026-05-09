export default function RecipeSkeleton() {
  return (
    <div className="space-y-4">
      {/* Recipe Header Skeleton */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {/* Recipe Title */}
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-zinc-100" />
          </div>
          
          {/* Recipe Meta */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-6 w-12 animate-pulse rounded-full bg-zinc-100" />
          </div>
        </div>
      </div>

      {/* Ingredients Section Skeleton */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-200" />
                <div className={`h-4 animate-pulse rounded-full bg-zinc-100`} style={{width: `${Math.random() * 40 + 60}%`}} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cooking Steps Skeleton */}
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 h-8 w-8 animate-pulse rounded-full bg-[#FF6B35]/20" />
                <div className="flex-1 space-y-2">
                  <div className={`h-4 animate-pulse rounded-full bg-zinc-100`} style={{width: `${Math.random() * 30 + 70}%`}} />
                  <div className={`h-4 animate-pulse rounded-full bg-zinc-100`} style={{width: `${Math.random() * 40 + 60}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section Skeleton */}
      <div className="rounded-3xl border border-black/5 bg-gradient-to-r from-[#2F9E44]/5 to-[#FF6B35]/5 p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
          <div className="space-y-2">
            <div className={`h-4 animate-pulse rounded-full bg-zinc-100`} style={{width: `${Math.random() * 20 + 80}%`}} />
            <div className={`h-4 animate-pulse rounded-full bg-zinc-100`} style={{width: `${Math.random() * 30 + 70}%`}} />
          </div>
        </div>
      </div>
    </div>
  )
}
