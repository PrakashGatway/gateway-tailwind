import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import {
  TrafficChart,
  TopPagesChart,
  TopCountriesChart,
  DevicesChart,
  FormsChart,
} from "@/components/admin/AnalyticsCharts";
import { getAnalyticsOverview } from "@/lib/admin/analytics-overview";

export const dynamic = "force-dynamic";

export default async function TrafficPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.range) ? params.range[0] : params.range;
  const range =
    raw === "1" || raw === "7" || raw === "15"
      ? (Number(raw) as 1 | 7 | 15)
      : 15;
  const analytics = await getAnalyticsOverview(range);

  return (
    <main className="mx-auto max-w-[1480px] space-y-5 px-5 py-7 sm:px-7 lg:px-9">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#202b3f]">
            Traffic trends
          </h1>
          <p className="mt-px max-w-2xl text-sm font-medium text-slate-500">
            A clear view of your visitors, most viewed pages, locations,
            devices, and form activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/activity?range=${range}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:text-[#c41430]"
          >
            Visitor activity <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <div
            className="flex rounded-xl border border-slate-200 bg-white p-1"
            aria-label="Traffic date range"
          >
            {([1, 7, 15] as const).map((days) => (
              <Link
                key={days}
                href={`/admin/traffic?range=${days}`}
                aria-current={range === days ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${range === days ? "bg-[#d81635] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
              >
                {days === 1 ? "24h" : `${days}d`}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <TrafficChart
        points={analytics.traffic}
        range={range}
        summary={analytics.summary}
      />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <TopPagesChart pages={analytics.topPages} />
        <TopCountriesChart
          countries={analytics.countries}
          cities={analytics.cities}
        />
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <DevicesChart devices={analytics.devices} />
        <FormsChart forms={analytics.forms} />
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock3 className="h-3.5 w-3.5" />
        Times are shown in IST. Analytics records expire after 15 days; form
        counts represent submission attempts.
      </p>
    </main>
  );
}
