import Link from "next/link";
import { Activity, Clock3, FilePenLine, Globe2, MousePointerClick, Users } from "lucide-react";
import VisitorList from "@/components/admin/VisitorList";
import { getVisitorOverview, VISITORS_PER_PAGE, type VisitorFilters } from "@/lib/admin/visitors";

export const dynamic = "force-dynamic";

function pageUrl(range: VisitorFilters["range"], page: number) {
  return `/admin/activity?range=${range}&page=${page}`;
}

export default async function ActivityPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const range = [1, 7, 15].includes(Number(params.range)) ? Number(params.range) as 1 | 7 | 15 : 15;
  const requestedPage = Math.max(1, Math.min(10000, Number.parseInt(String(params.page || "1"), 10) || 1));
  const data = await getVisitorOverview({ range, page: requestedPage });
  const totalPages = Math.max(1, Math.ceil(data.counts.visitors / VISITORS_PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const visitors = page === requestedPage ? data.visitors : (await getVisitorOverview({ range, page })).visitors;
  const metrics = [
    { name: "Unique visitors", value: data.counts.visitors, icon: Users },
    { name: "Returned", value: data.counts.returning, icon: Clock3 },
    { name: "Page views", value: data.counts.pageViews, icon: Globe2 },
    { name: "Clicks", value: data.counts.clicks, icon: MousePointerClick },
    { name: "Forms started", value: data.counts.formStarts, icon: FilePenLine },
    { name: "Forms submitted", value: data.counts.forms, icon: Activity },
  ];
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => Math.max(1, Math.min(totalPages - 4, page - 2)) + index);

  return (
    <main className="mx-auto max-w-7xl font-medium px-6 py-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className=" text-2xl font-bold tracking-tight text-[#1b2538]">Website activity</h1>
          <p className="mt-px text-sm text-slate-500">One row per browser ID, sorted by its latest activity. Events expire after 15 days.</p>
        </div>
        <div className="flex gap-2" aria-label="Date range">
          {([1, 7, 15] as const).map((days) => (
            <Link key={days} href={pageUrl(days, 1)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${range === days ? "bg-[#d81635] text-white -md -rose-200" : "bg-white text-slate-600 hover:bg-rose-50"}`}>
              {days === 1 ? "24 hours" : `${days} days`}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {metrics.map(({ name, value, icon: Icon }) => (
          <div key={name} className="rounded-2xl border border-slate-200 bg-white p-5 -sm">
            <p className=" text-2xl font-bold text-[#1b2538]">{value.toLocaleString("en-IN")}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{name}</p>
          </div>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-[20px] border border-slate-200 bg-white ">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:px-7">
          <div><h2 className="text-lg font-bold text-[#1b2538]">Visitors</h2><p className="mt-1 text-xs text-slate-500">Select a visitor to explore their timeline and submitted form details.</p></div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{VISITORS_PER_PAGE} per page</span>
        </div>
        <VisitorList visitors={visitors} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs text-slate-500">Showing {visitors.length ? (page - 1) * VISITORS_PER_PAGE + 1 : 0}–{Math.min(page * VISITORS_PER_PAGE, data.counts.visitors)} of {data.counts.visitors.toLocaleString("en-IN")} visitors</p>
          <nav aria-label="Visitor pages" className="flex items-center gap-1">
            <Link aria-disabled={page === 1} tabIndex={page === 1 ? -1 : undefined} href={pageUrl(range, Math.max(1, page - 1))} className={`rounded-lg px-3 py-2 text-xs font-semibold ${page === 1 ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100"}`}>Previous</Link>
            {pageNumbers.map((number) => <Link key={number} href={pageUrl(range, number)} aria-current={number === page ? "page" : undefined} className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-semibold ${number === page ? "bg-[#1c263a] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{number}</Link>)}
            <Link aria-disabled={page === totalPages} tabIndex={page === totalPages ? -1 : undefined} href={pageUrl(range, Math.min(totalPages, page + 1))} className={`rounded-lg px-3 py-2 text-xs font-semibold ${page === totalPages ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100"}`}>Next</Link>
          </nav>
        </div>
      </section>
      <p className="mt-4 text-xs text-slate-400">Form activity shows submit attempts. Contact and selected enquiry details are stored with those events for up to 15 days.</p>
    </main>
  );
}
