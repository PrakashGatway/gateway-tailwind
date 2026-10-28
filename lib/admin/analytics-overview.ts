import { activityCutoff, getActivityCollection } from "@/lib/analytics";

type Range = 1 | 7 | 15;
type TrafficRow = { _id: string; pageViews: number; visitors: string[]; sessions: string[] };
type PageRow = { _id: string; views: number; visitors: string[] };
type BreakdownRow = { _id: string | null; views: number };
type CityRow = { _id: { city: string; country: string | null }; views: number };
type SummaryRow = { pageViews: number; visitors: string[]; sessions: string[] };

const clock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

function bucketKey(date: Date, hourly: boolean) {
  const parts = Object.fromEntries(clock.formatToParts(date).map((part) => [part.type, part.value]));
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return hourly ? `${day} ${parts.hour}` : day;
}

export async function getAnalyticsOverview(range: Range) {
  const collection = await getActivityCollection();
  const now = Date.now();
  const since = new Date(Math.max(activityCutoff().getTime(), now - range * 86400000));
  const pageMatch = { type: "page_view", occurredAt: { $gte: since } };
  const format = range === 1 ? "%Y-%m-%d %H" : "%Y-%m-%d";

  const [trafficRows, pageRows, deviceRows, countryRows, cityRows, formRows, summaryRows] = await Promise.all([
    collection.aggregate<TrafficRow>([
      { $match: pageMatch },
      { $group: {
        _id: { $dateToString: { format, date: "$occurredAt", timezone: "Asia/Kolkata" } },
        pageViews: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        sessions: { $addToSet: "$sessionId" },
      } },
      { $sort: { _id: 1 } },
    ]).toArray(),
    collection.aggregate<PageRow>([
      { $match: pageMatch },
      { $group: { _id: "$path", views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
      { $sort: { views: -1, _id: 1 } },
      { $limit: 8 },
    ]).toArray(),
    collection.aggregate<BreakdownRow>([
      { $match: pageMatch },
      { $group: { _id: "$device", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
    ]).toArray(),
    collection.aggregate<BreakdownRow>([
      { $match: { ...pageMatch, country: { $ne: null } } },
      { $group: { _id: "$country", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 6 },
    ]).toArray(),
    collection.aggregate<CityRow>([
      { $match: { ...pageMatch, city: { $exists: true, $nin: [null, ""] } } },
      { $group: { _id: { city: "$city", country: "$country" }, views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
    ]).toArray(),
    collection.aggregate<BreakdownRow>([
      { $match: { type: "form_submit", occurredAt: { $gte: since } } },
      { $group: { _id: "$label", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 6 },
    ]).toArray(),
    collection.aggregate<SummaryRow>([
      { $match: pageMatch },
      { $group: {
        _id: null,
        pageViews: { $sum: 1 },
        visitors: { $addToSet: "$visitorId" },
        sessions: { $addToSet: "$sessionId" },
      } },
    ]).toArray(),
  ]);

  const byBucket = new Map(trafficRows.map((row) => [row._id, row]));
  const hourly = range === 1;
  // Rolling windows include a partial bucket at both ends.
  const count = hourly ? 25 : range + 1;
  const step = hourly ? 3600000 : 86400000;
  const traffic = Array.from({ length: count }, (_, index) => {
    const date = new Date(now - (count - 1 - index) * step);
    const key = bucketKey(date, hourly);
    const row = byBucket.get(key);
    return {
      key,
      label: hourly ? `${key.slice(11)}:00` : `${key.slice(8)}/${key.slice(5, 7)}`,
      pageViews: row?.pageViews || 0,
      visitors: row?.visitors.length || 0,
      sessions: row?.sessions.length || 0,
    };
  });

  return {
    summary: {
      pageViews: summaryRows[0]?.pageViews || 0,
      visitors: summaryRows[0]?.visitors.length || 0,
      sessions: summaryRows[0]?.sessions.length || 0,
    },
    traffic,
    topPages: pageRows.map((row) => ({ path: row._id, views: row.views, visitors: row.visitors.length })),
    devices: deviceRows.map((row) => ({ name: row._id || "Unknown", views: row.views })),
    countries: countryRows.map((row) => ({ name: row._id || "Unknown", views: row.views })),
    cities: cityRows.map((row) => ({ name: `${row._id.city}${row._id.country ? `, ${row._id.country}` : ""}`, views: row.views })),
    forms: formRows.map((row) => ({ name: row._id || "Unnamed form", count: row.views })),
  };
}
