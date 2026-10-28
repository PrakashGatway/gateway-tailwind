import Link from "next/link";
import {
  Activity,
  Clock3,
  FilePenLine,
  Globe2,
  MousePointerClick,
  RotateCcw,
  Users,
} from "lucide-react";
import VisitorList from "@/components/admin/VisitorList";
import {
  getVisitorOverview,
  VISITORS_PER_PAGE,
  type VisitorFilters,
} from "@/lib/admin/visitors";

export const dynamic = "force-dynamic";

const number = new Intl.NumberFormat("en-IN");
const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#d81635] focus:ring-2 focus:ring-rose-100";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function choice<T extends string>(
  value: string | undefined,
  options: readonly T[],
  fallback: T,
): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

function threshold(value: string | undefined, options: readonly number[]) {
  const parsed = Number(value);
  return options.includes(parsed) ? parsed : 0;
}

function parseFilters(
  params: Record<string, string | string[] | undefined>,
): VisitorFilters {
  const rawRange = Number(one(params.range));
  return {
    range: rawRange === 1 || rawRange === 7 || rawRange === 15 ? rawRange : 15,
    page: Math.max(
      1,
      Math.min(10000, Number.parseInt(one(params.page) || "1", 10) || 1),
    ),
    segment: choice(
      one(params.segment),
      ["all", "new", "returning"] as const,
      "all",
    ),
    minPageViews: threshold(one(params.minPageViews), [0, 1, 2, 5, 10]),
    minFormStarts: threshold(one(params.minFormStarts), [0, 1, 2, 5]),
    minFormSubmits: threshold(one(params.minFormSubmits), [0, 1, 2, 5]),
    minTimeSeconds: threshold(one(params.minTimeSeconds), [0, 30, 60, 300]),
    device: choice(
      one(params.device),
      ["all", "desktop", "mobile", "tablet"] as const,
      "all",
    ),
    sort: choice(
      one(params.sort),
      ["recent", "views", "time", "forms"] as const,
      "recent",
    ),
  };
}

function pageUrl(
  filters: VisitorFilters,
  page: number,
  overrides: Partial<VisitorFilters> = {},
) {
  const next = { ...filters, ...overrides, page };
  const params = new URLSearchParams({
    range: String(next.range),
    page: String(next.page),
    segment: next.segment,
    minPageViews: String(next.minPageViews),
    minFormStarts: String(next.minFormStarts),
    minFormSubmits: String(next.minFormSubmits),
    minTimeSeconds: String(next.minTimeSeconds),
    device: next.device,
    sort: next.sort,
  });
  return `/admin/activity?${params.toString()}#visitors`;
}

function formatDuration(milliseconds: number) {
  const minutes = Math.round(milliseconds / 60000);
  if (minutes < 1) return `${Math.round(milliseconds / 1000)} sec`;
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const initial = await getVisitorOverview(filters);
  const totalPages = Math.max(
    1,
    Math.ceil(initial.totalVisitors / VISITORS_PER_PAGE),
  );
  const page = Math.min(filters.page, totalPages);
  const data =
    page === filters.page
      ? initial
      : await getVisitorOverview({ ...filters, page });
  const counts = data.counts;
  const conversion = counts.formStarts
    ? Math.round((counts.forms / counts.formStarts) * 100)
    : 0;
  const pagesPerSession = counts.sessions
    ? (counts.pageViews / counts.sessions).toFixed(1)
    : "0.0";
  const metrics = [
    {
      name: "Unique visitors",
      value: number.format(counts.visitors),
      detail: "Browsers in period",
      icon: Users,
      href: pageUrl(filters, 1, { segment: "all" }),
    },
    {
      name: "Returning visitors",
      value: number.format(counts.returning),
      detail: "More than one session",
      icon: RotateCcw,
      href: pageUrl(filters, 1, { segment: "returning" }),
    },
    {
      name: "Visits",
      value: number.format(counts.sessions),
      detail: "Tracked sessions",
      icon: Activity,
      href: pageUrl(filters, 1),
    },
    {
      name: "Page views",
      value: number.format(counts.pageViews),
      detail: `${pagesPerSession} per visit`,
      icon: Globe2,
      href: pageUrl(filters, 1, { minPageViews: 1 }),
    },
    {
      name: "Clicks",
      value: number.format(counts.clicks),
      detail: "Buttons and links",
      icon: MousePointerClick,
      href: pageUrl(filters, 1),
    },
    {
      name: "Forms started",
      value: number.format(counts.formStarts),
      detail: "Interaction began",
      icon: FilePenLine,
      href: pageUrl(filters, 1, { minFormStarts: 1 }),
    },
    {
      name: "Forms submitted",
      value: number.format(counts.forms),
      detail: `${conversion}% of starts`,
      icon: FilePenLine,
      href: pageUrl(filters, 1, { minFormSubmits: 1 }),
    },
    {
      name: "Visible time",
      value: formatDuration(counts.timeSpentMs),
      detail: "Recorded page time",
      icon: Clock3,
      href: pageUrl(filters, 1, { minTimeSeconds: 30 }),
    },
  ];
  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => Math.max(1, Math.min(totalPages - 4, page - 2)) + index,
  );

  return (
    <main className="mx-auto max-w-[1500px] space-y-5 px-5 py-6 font-medium sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1b2538]">
            Visitor activity
          </h1>
          <p className="mt-px text-sm text-slate-500">
            Filter individual journeys and review activity timelines. Data
            expires after 15 days.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/traffic?range=${filters.range}`}
            className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-[#c41430] transition hover:bg-rose-100"
          >
            View traffic trends
          </Link>
          <div className="flex gap-2" aria-label="Date range">
            {([1, 7, 15] as const).map((days) => (
              <Link
                key={days}
                href={pageUrl(filters, 1, { range: days }).replace(
                  "#visitors",
                  "",
                )}
                aria-current={filters.range === days ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${filters.range === days ? "bg-[#d81635] text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-rose-50"}`}
              >
                {days === 1 ? "24 hours" : `${days} days`}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section
        aria-label="Traffic summary"
        className="grid gap-3 grid-cols-3 sm:grid-cols-5 lg:grid-cols-8"
      >
        {metrics.map(({ name, value, detail, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className="group rounded-[18px] border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5"
          >
            <div className="h-full flex flex-col items-start justify-between">
              <p className=" text-3xl font-semibold tracking-tight text-[#1b2538]">
                {value}
              </p>
              <span className="text-[13px] font-semibold text-slate-500">
                {name}
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section
        id="visitors"
        className="scroll-mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-white"
      >
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#1b2538]">
                Visitor explorer
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                One row per browser ID. Select a visitor for their full activity
                timeline.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {number.format(data.totalVisitors)} match · {VISITORS_PER_PAGE}{" "}
              per page
            </span>
          </div>
          <form
            action="/admin/activity"
            method="get"
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
          >
            <input type="hidden" name="range" value={filters.range} />
            <label className="text-[11px] font-bold text-slate-500">
              Visitor type
              <select
                name="segment"
                defaultValue={filters.segment}
                className={inputClass}
              >
                <option value="all">All visitors</option>
                <option value="new">One session</option>
                <option value="returning">Returning</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Page visits
              <select
                name="minPageViews"
                defaultValue={filters.minPageViews}
                className={inputClass}
              >
                <option value="0">Any</option>
                <option value="1">1 or more</option>
                <option value="2">2 or more</option>
                <option value="5">5 or more</option>
                <option value="10">10 or more</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Forms started
              <select
                name="minFormStarts"
                defaultValue={filters.minFormStarts}
                className={inputClass}
              >
                <option value="0">Any</option>
                <option value="1">1 or more</option>
                <option value="2">2 or more</option>
                <option value="5">5 or more</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Forms submitted
              <select
                name="minFormSubmits"
                defaultValue={filters.minFormSubmits}
                className={inputClass}
              >
                <option value="0">Any</option>
                <option value="1">1 or more</option>
                <option value="2">2 or more</option>
                <option value="5">5 or more</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Visible time
              <select
                name="minTimeSeconds"
                defaultValue={filters.minTimeSeconds}
                className={inputClass}
              >
                <option value="0">Any</option>
                <option value="30">30+ sec</option>
                <option value="60">1+ min</option>
                <option value="300">5+ min</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Device
              <select
                name="device"
                defaultValue={filters.device}
                className={inputClass}
              >
                <option value="all">All devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>
            </label>
            <label className="text-[11px] font-bold text-slate-500">
              Sort by
              <select
                name="sort"
                defaultValue={filters.sort}
                className={inputClass}
              >
                <option value="recent">Latest activity</option>
                <option value="views">Most page views</option>
                <option value="time">Most time</option>
                <option value="forms">Most forms</option>
              </select>
            </label>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="rounded-xl bg-[#d81635] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#b9132d]"
              >
                Apply
              </button>
              <Link
                href={`/admin/activity?range=${filters.range}#visitors`}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>
        <VisitorList visitors={data.visitors} />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-7">
          <p className="text-xs text-slate-500">
            Showing{" "}
            {data.visitors.length ? (page - 1) * VISITORS_PER_PAGE + 1 : 0}–
            {Math.min(page * VISITORS_PER_PAGE, data.totalVisitors)} of{" "}
            {number.format(data.totalVisitors)} visitors
          </p>
          <nav aria-label="Visitor pages" className="flex items-center gap-1">
            <Link
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              href={pageUrl(filters, Math.max(1, page - 1))}
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${page === 1 ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Previous
            </Link>
            {pageNumbers.map((index) => (
              <Link
                key={index}
                href={pageUrl(filters, index)}
                aria-current={index === page ? "page" : undefined}
                className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-semibold ${index === page ? "bg-[#1c263a] text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {index}
              </Link>
            ))}
            <Link
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : undefined}
              href={pageUrl(filters, Math.min(totalPages, page + 1))}
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${page === totalPages ? "pointer-events-none text-slate-300" : "text-slate-600 hover:bg-slate-100"}`}
            >
              Next
            </Link>
          </nav>
        </div>
      </section>
      <p className="text-[11px] text-slate-400">
        Time on page counts visible tab time from completed visits; it is
        approximate. Form submissions represent attempts, and recorded analytics
        expire after 15 days.
      </p>
    </main>
  );
}
