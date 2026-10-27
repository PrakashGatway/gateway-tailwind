export default function AdminDashboardLoading() {
  return (
    <div className="mx-auto max-w-[1440px] animate-pulse space-y-7 px-5 py-7 sm:px-8 lg:px-10 lg:py-9" aria-label="Loading dashboard">
      <div className="space-y-3"><div className="h-3 w-32 rounded bg-[#f4dce2]" /><div className="h-10 w-52 rounded-xl bg-[#e9eaf1]" /><div className="h-4 w-80 max-w-full rounded bg-[#e9eaf1]" /></div>
      <div className="h-72 rounded-[28px] bg-gradient-to-br from-[#fff0f3] to-white shadow-sm" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-40 rounded-[22px] bg-white shadow-sm" />)}</div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.9fr)]"><div className="h-80 rounded-[24px] bg-white shadow-sm" /><div className="h-80 rounded-[24px] bg-white shadow-sm" /></div>
    </div>
  );
}
