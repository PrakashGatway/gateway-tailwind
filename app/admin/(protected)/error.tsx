"use client";

export default function AdminDashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-2xl font-bold text-[#d81635]">!</div>
      <h1 className="mt-6 text-2xl font-bold text-[#1b2538]">Dashboard unavailable</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">We couldn’t load the latest data. Please check the database connection and try again.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-xl bg-[#d81635] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b9132d]">Try again</button>
    </div>
  );
}
