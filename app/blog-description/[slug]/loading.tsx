function Placeholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200/80 motion-reduce:animate-none ${className}`}
    />
  );
}

export default function BlogDetailLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading blog article">
      <span className="sr-only">Loading blog article…</span>

      <section className="relative bg-[#f3e8ff] py-8">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-2">
            <Placeholder className="h-4 w-12 bg-white/80" />
            <span aria-hidden="true" className="text-slate-400">›</span>
            <Placeholder className="h-4 w-10 bg-white/80" />
            <span aria-hidden="true" className="text-slate-400">›</span>
            <Placeholder className="h-4 w-32 bg-white/80" />
          </div>

          <div className="space-y-3">
            <Placeholder className="h-9 w-full max-w-3xl bg-white/85 md:h-11" />
            <Placeholder className="h-9 w-3/4 max-w-2xl bg-white/85 md:h-11" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Placeholder className="h-5 w-28 bg-white/75" />
            <Placeholder className="h-7 w-24 rounded-full bg-white/75" />
            <Placeholder className="h-7 w-24 rounded-full bg-white/75" />
          </div>
          <div aria-hidden="true" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#d71635]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#d71635]/25 border-t-[#d71635] motion-reduce:animate-none" />
            Loading article…
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div>
            <Placeholder className="aspect-[16/9] w-full rounded-2xl bg-slate-200" />
            <div className="mt-8 space-y-4">
              <Placeholder className="h-7 w-2/3 bg-slate-200" />
              <Placeholder className="h-4 w-full" />
              <Placeholder className="h-4 w-[94%]" />
              <Placeholder className="h-4 w-[86%]" />
              <Placeholder className="mt-7 h-4 w-full" />
              <Placeholder className="h-4 w-[92%]" />
              <Placeholder className="h-4 w-3/4" />
            </div>
          </div>

          <aside className="space-y-6" aria-hidden="true">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <Placeholder className="h-6 w-2/3" />
              <Placeholder className="mt-3 h-4 w-4/5" />
              <Placeholder className="mt-6 h-4 w-24" />
              <Placeholder className="mt-2 h-11 w-full rounded-xl" />
              <Placeholder className="mt-4 h-4 w-32" />
              <Placeholder className="mt-2 h-11 w-full rounded-xl" />
              <Placeholder className="mt-4 h-4 w-28" />
              <Placeholder className="mt-2 h-11 w-full rounded-xl" />
              <Placeholder className="mt-6 h-11 w-full rounded-xl bg-red-100" />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <Placeholder className="h-6 w-1/2" />
              <Placeholder className="mt-5 h-16 w-full rounded-xl" />
              <Placeholder className="mt-4 h-16 w-full rounded-xl" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
