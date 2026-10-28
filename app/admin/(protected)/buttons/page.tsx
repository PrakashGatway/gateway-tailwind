import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  PhoneCall,
  UsersRound,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  BUTTONS_PER_PAGE,
  getButtonAnalytics,
  type ButtonFilters,
} from "@/lib/admin/button-analytics";

export const dynamic = "force-dynamic";

type Params = {
  range?: string | string[];
  kind?: string | string[];
  route?: string | string[];
  search?: string | string[];
  page?: string | string[];
};
const number = new Intl.NumberFormat("en-IN");
const date = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const selectClass =
  "min-h-11 rounded-xl border border-[#e1e5ed] bg-white px-3.5 text-sm font-semibold text-[#354158] outline-none focus:border-[#d81635] focus:ring-4 focus:ring-rose-100";

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
function parseFilters(params: Params): ButtonFilters {
  const rawRange = first(params.range);
  const range =
    rawRange === "1" || rawRange === "7" || rawRange === "15"
      ? (Number(rawRange) as 1 | 7 | 15)
      : 15;
  const rawKind = first(params.kind);
  const kind =
    rawKind === "whatsapp" ||
    rawKind === "phone" ||
    rawKind === "button" ||
    rawKind === "link"
      ? rawKind
      : "all";
  const rawRoute = (first(params.route) || "").trim();
  const route =
    rawRoute.startsWith("/") && !rawRoute.startsWith("//")
      ? rawRoute.slice(0, 240)
      : "";
  const search = (first(params.search) || "").trim().slice(0, 80);
  const page = Math.min(10000, Math.max(1, Number(first(params.page)) || 1));
  return { range, kind, route, search, page: Math.floor(page) };
}
function href(filters: ButtonFilters, next: Partial<ButtonFilters>) {
  const value = { ...filters, ...next };
  const params = new URLSearchParams();
  if (value.range !== 15) params.set("range", String(value.range));
  if (value.kind !== "all") params.set("kind", value.kind);
  if (value.route) params.set("route", value.route);
  if (value.search) params.set("search", value.search);
  if (value.page > 1) params.set("page", String(value.page));
  const query = params.toString();
  return `/admin/buttons${query ? `?${query}` : ""}`;
}

export default async function ButtonTrackerPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const filters = parseFilters(await searchParams);
  const data = await getButtonAnalytics(filters);
  const pages = Math.max(1, Math.ceil(data.total / BUTTONS_PER_PAGE));
  const maxRoute = Math.max(1, ...data.routes.map((row) => row.clicks));
  const maxTrend = Math.max(1, ...data.trend.map((row) => row.clicks));
  const rangeLabel = filters.range === 1 ? "24 hours" : `${filters.range} days`;

  return (
    <main className="mx-auto max-w-[1500px] font-medium space-y-3 px-5 py-7 sm:px-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#202b3f]">
            Button tracker
          </h1>
          <p className="mt-px max-w-2xl text-sm font-medium text-slate-500">
            See which buttons and contact links people click, on each page.
          </p>
        </div>
        <span className="rounded-full border border-[#e5e8ef] bg-white px-3 py-2 text-[11px] font-semibold text-slate-500">
          Last {rangeLabel} · IST
        </span>
      </header>

      <form
        action="/admin/buttons"
        method="get"
        className="grid gap-3 rounded-[22px] border border-[#e6eaf1] bg-white p-4 shadow-[0_10px_28px_-28px_rgba(31,41,55,.25)] sm:grid-cols-2 lg:grid-cols-[130px_160px_minmax(180px,1fr)_minmax(180px,1fr)_auto] lg:items-end"
      >
        <label className="grid gap-1.5 text-[11px] font-bold text-slate-500">
          Time range
          <select
            name="range"
            defaultValue={filters.range}
            className={selectClass}
          >
            <option value="1">24 hours</option>
            <option value="7">7 days</option>
            <option value="15">15 days</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-[11px] font-bold text-slate-500">
          Click type
          <select
            name="kind"
            defaultValue={filters.kind}
            className={selectClass}
          >
            <option value="all">All clicks</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone number</option>
            <option value="button">Buttons</option>
            <option value="link">Other links</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-[11px] font-bold text-slate-500">
          Page route
          <input
            name="route"
            list="button-routes"
            defaultValue={filters.route}
            placeholder="All pages or /study-in-uk"
            className={selectClass}
          />
          <datalist id="button-routes">
            {data.routeOptions.map((route) => (
              <option key={route} value={route} />
            ))}
          </datalist>
        </label>
        <label className="grid gap-1.5 text-[11px] font-bold text-slate-500">
          Button label or number
          <input
            name="search"
            defaultValue={filters.search}
            placeholder="Search clicks"
            className={selectClass}
          />
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-xl bg-[#d81635] px-5 text-sm font-bold text-white transition hover:bg-[#b9142e]"
        >
          Apply filters
        </button>
      </form>

      <div
        className="flex flex-wrap items-center gap-2"
        aria-label="Quick click filters"
      >
        {(["all", "whatsapp", "phone", "button", "link"] as const).map(
          (kind) => (
            <Link
              key={kind}
              href={href(filters, { kind, page: 1 })}
              aria-current={filters.kind === kind ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${filters.kind === kind ? "bg-[#263247] text-white" : "border border-[#e3e7ee] bg-white text-slate-600 hover:border-rose-200 hover:text-[#c41430]"}`}
            >
              {kind === "all"
                ? "All clicks"
                : kind === "phone"
                  ? "Phone numbers"
                  : kind === "button"
                    ? "Buttons"
                    : kind === "link"
                      ? "Other links"
                      : "WhatsApp"}
            </Link>
          ),
        )}
        {(filters.route ||
          filters.search ||
          filters.kind !== "all" ||
          filters.range !== 15) && (
          <Link
            href="/admin/buttons"
            className="ml-auto text-xs font-bold text-[#c41430] hover:underline"
          >
            Clear filters
          </Link>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total clicks",
            value: data.summary.clicks,
            icon: MousePointerClick,
            tint: "bg-[#fff0f3] text-[#d81635]",
          },
          {
            label: "Unique visitors",
            value: data.summary.visitors,
            icon: UsersRound,
            tint: "bg-[#eef6ff] text-[#4c8dcb]",
          },
          {
            label: "WhatsApp clicks",
            value: data.summary.whatsapp,
            icon: FaWhatsapp,
            tint: "bg-[#eafaf1] text-[#149761]",
          },
          {
            label: "Phone clicks",
            value: data.summary.phone,
            icon: PhoneCall,
            tint: "bg-[#fff4e7] text-[#ce8832]",
          },
        ].map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="rounded-[20px] border border-[#e6eaf1] bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-500">
                {label}
              </span>
            </div>
            <p className="mt-1 text-[28px] font-bold tracking-tight text-[#263247]">
              {number.format(value)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#c41430]">
              Click activity
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#202b3f]">Trend</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filters.range === 1 ? "Hourly" : "Daily"} clicks in IST for the
              selected filters
            </p>
          </div>
          {data.trend.length ? (
            <div className="mt-7 flex h-40 items-end gap-1.5 overflow-x-auto pb-5 sm:gap-2">
              {data.trend.map((point) => (
                <div
                  key={point._id}
                  className="group relative flex h-full min-w-5 flex-1 flex-col justify-end"
                  title={`${point._id}: ${number.format(point.clicks)} clicks`}
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-[#d81635] to-[#f3a0ae] transition group-hover:from-[#b9142e]"
                    style={{
                      height: `${Math.max(5, (point.clicks / maxTrend) * 100)}%`,
                    }}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium text-slate-400">
                    {filters.range === 1
                      ? `${point._id.slice(11)}h`
                      : point._id.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-7 rounded-xl bg-[#fafbfd] p-8 text-center text-xs text-slate-400">
              No clicks match these filters.
            </p>
          )}
        </section>
        <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#c41430]">
              Where visitors click
            </p>
            <h2 className=" text-lg font-bold text-[#202b3f]">
              Top routes
            </h2>
            <p className="text-xs text-slate-500">
              Select a route to see its buttons
            </p>
          </div>
          <div className="mt-6 space-y-4">
            {data.routes.length ? (
              data.routes.map((row) => (
                <div key={row._id}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <Link
                      href={href(filters, { route: row._id, page: 1 })}
                      className="min-w-0 truncate font-semibold text-[#354158] hover:text-[#c41430]"
                      title={row._id}
                    >
                      {row._id}
                    </Link>
                    <strong className="shrink-0 text-[#202b3f]">
                      {number.format(row.clicks)}
                    </strong>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#f1f3f7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4c8dcb] to-[#a9d1f4]"
                      style={{ width: `${(row.clicks / maxRoute) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-xl bg-[#fafbfd] p-8 text-center text-xs text-slate-400">
                No route data yet.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-[22px] border border-[#e6eaf1] bg-white">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[#eef0f4] px-5 py-5 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#c41430]">
              Button performance
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#202b3f]">
              Clicked elements
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Grouped by page, label, click type, and destination
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {number.format(data.total)} results
          </span>
        </div>
        {data.rows.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-[#fafbfe] text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">
                <tr>
                  <th className="px-5 py-3.5 sm:px-6">Element</th>
                  <th className="px-4 py-3.5">Route</th>
                  <th className="px-4 py-3.5">Clicks</th>
                  <th className="px-4 py-3.5">Visitors</th>
                  <th className="px-4 py-3.5">Last click</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef0f4]">
                {data.rows.map((row, index) => (
                  <tr
                    key={`${row._id.path}:${row._id.kind}:${row._id.label}:${row._id.target}:${index}`}
                    className="transition hover:bg-[#fcfcfe]"
                  >
                    <td className="max-w-[350px] px-5 py-4 sm:px-6">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 rounded-lg px-2 py-1 text-[10px] font-bold capitalize ${row._id.kind === "whatsapp" ? "bg-emerald-50 text-emerald-700" : row._id.kind === "phone" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {row._id.kind}
                        </span>
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-[#263247]">
                            {row._id.label || "Unlabeled control"}
                          </p>
                          {row._id.target && (
                            <p className="mt-1 break-all text-[11px] text-slate-400">
                              {row._id.target}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[250px] px-4 py-4">
                      <Link
                        href={row._id.path}
                        target="_blank"
                        className="inline-flex max-w-full items-center gap-1 text-xs font-semibold text-[#526079] hover:text-[#c41430]"
                      >
                        <span className="truncate">{row._id.path}</span>
                        <ArrowUpRight className="h-3 w-3 shrink-0" />
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-bold text-[#263247]">
                      {number.format(row.clicks)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-600">
                      {number.format(row.visitors)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                      {date.format(row.lastAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <MousePointerClick className="mx-auto h-8 w-8 text-rose-200" />
            <p className="mt-3 text-sm font-semibold text-[#263247]">
              No clicks found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try another route, type, or date range.
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eef0f4] px-5 py-4 text-xs text-slate-500 sm:px-6">
          <span>
            Page {filters.page} of {pages} · {BUTTONS_PER_PAGE} per page
          </span>
          <div className="flex gap-2">
            <Link
              aria-disabled={filters.page <= 1}
              tabIndex={filters.page <= 1 ? -1 : undefined}
              href={href(filters, { page: Math.max(1, filters.page - 1) })}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-bold ${filters.page <= 1 ? "pointer-events-none border-slate-100 text-slate-300" : "border-slate-200 text-[#526079] hover:text-[#c41430]"}`}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Link>
            <Link
              aria-disabled={filters.page >= pages}
              tabIndex={filters.page >= pages ? -1 : undefined}
              href={href(filters, { page: Math.min(pages, filters.page + 1) })}
              className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-bold ${filters.page >= pages ? "pointer-events-none border-slate-100 text-slate-300" : "border-slate-200 text-[#526079] hover:text-[#c41430]"}`}
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
      <p className="text-[11px] text-slate-400">
        Click records follow the existing 15-day analytics retention. Older
        events may only have a label, so contact click categories are best
        identified for new visits.
      </p>
    </main>
  );
}
