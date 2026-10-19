type MarketingPageLoadingProps = {
  kind: "destination" | "course";
};

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-white/75 motion-reduce:animate-none ${className}`}
    />
  );
}

export default function MarketingPageLoading({ kind }: MarketingPageLoadingProps) {
  const isDestination = kind === "destination";
  const label = isDestination ? "Loading destination…" : "Loading test preparation…";

  return (
    <main role="status" aria-live="polite" aria-label={label}>
      <section className={`relative overflow-hidden ${isDestination ? "bg-pink-100" : "bg-[#f3e8ff]"}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <div className="space-y-5">
            <Skeleton className="h-10 w-full max-w-xl md:h-12" />
            <Skeleton className="h-10 w-4/5 max-w-md md:h-12" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-[92%] max-w-xl" />
              <Skeleton className="h-4 w-3/4 max-w-xl" />
            </div>
            {isDestination && (
              <div className="flex flex-wrap gap-2 pt-2" aria-hidden="true">
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            )}
            <Skeleton className="h-11 w-40 rounded-xl bg-red-200/80" />
            <div className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-[#d71635]">
              <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-[#d71635]/25 border-t-[#d71635] motion-reduce:animate-none" />
              {label}
            </div>
          </div>

          {isDestination ? (
            <div aria-hidden="true" className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              <Skeleton className="h-7 w-3/4 bg-slate-200" />
              <Skeleton className="mt-3 h-4 w-4/5 bg-slate-100" />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-11 w-full border border-slate-100 bg-slate-100" />
                ))}
              </div>
              <Skeleton className="mt-4 h-11 w-full border border-slate-100 bg-slate-100" />
              <Skeleton className="mt-6 h-11 w-full bg-red-100" />
            </div>
          ) : (
            <div aria-hidden="true" className="mx-auto aspect-[5/4] w-full max-w-md animate-pulse rounded-2xl bg-white/80 shadow-lg motion-reduce:animate-none" />
          )}
        </div>
      </section>

      <section aria-hidden="true" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Skeleton className="h-7 w-64 bg-slate-200" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl bg-slate-100" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <Skeleton className="h-12 w-12 rounded-xl bg-red-100" />
              <Skeleton className="mt-5 h-5 w-3/4 bg-slate-200" />
              <Skeleton className="mt-3 h-4 w-full bg-slate-100" />
              <Skeleton className="mt-2 h-4 w-5/6 bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
