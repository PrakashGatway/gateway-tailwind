import { activityCutoff, getActivityCollection, type ActivityEvent, type ActivityType } from "@/lib/analytics";

export type ActivityFilters = {
  type?: ActivityType;
  range: 1 | 7 | 15;
  page: number;
  visitorId?: string;
};

const PAGE_SIZE = 40;
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryLabel(country: string | null) {
  if (!country) return "Unknown country";
  try { return regionNames.of(country) || country; } catch { return country; }
}

export async function getActivityOverview(filters: ActivityFilters) {
  const collection = await getActivityCollection();
  const since = new Date(Math.max(activityCutoff().getTime(), Date.now() - filters.range * 86400000));
  const base = { occurredAt: { $gte: since } };
  const eventQuery = {
    ...base,
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.visitorId ? { visitorId: filters.visitorId } : {}),
  };

  const [events, totalEvents, counts, visitors] = await Promise.all([
    collection.find(eventQuery).sort({ occurredAt: -1 }).skip((filters.page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
    collection.countDocuments(eventQuery),
    collection.aggregate<{ visitors: number; returning: number; pageViews: number; clicks: number; formStarts: number; forms: number }>([
      { $match: base },
      { $group: {
        _id: "$visitorId",
        sessions: { $addToSet: "$sessionId" },
        pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
        clicks: { $sum: { $cond: [{ $eq: ["$type", "click"] }, 1, 0] } },
        formStarts: { $sum: { $cond: [{ $eq: ["$type", "form_start"] }, 1, 0] } },
        forms: { $sum: { $cond: [{ $eq: ["$type", "form_submit"] }, 1, 0] } },
      } },
      { $group: {
        _id: null,
        visitors: { $sum: 1 },
        returning: { $sum: { $cond: [{ $gt: [{ $size: "$sessions" }, 1] }, 1, 0] } },
        pageViews: { $sum: "$pageViews" },
        clicks: { $sum: "$clicks" },
        formStarts: { $sum: "$formStarts" },
        forms: { $sum: "$forms" },
      } },
    ]).toArray(),
    collection.aggregate<{ _id: string; lastSeen: Date; firstSeen: Date; sessions: string[]; events: number; country: string | null }>([
      { $match: base },
      { $sort: { occurredAt: -1 } },
      { $group: {
        _id: "$visitorId",
        lastSeen: { $first: "$occurredAt" },
        firstSeen: { $min: "$occurredAt" },
        sessions: { $addToSet: "$sessionId" },
        events: { $sum: 1 },
        country: { $first: "$country" },
      } },
      { $sort: { lastSeen: -1 } },
      { $limit: 12 },
    ]).toArray(),
  ]);

  return {
    events,
    totalEvents,
    pageSize: PAGE_SIZE,
    counts: counts[0] || { visitors: 0, returning: 0, pageViews: 0, clicks: 0, formStarts: 0, forms: 0 },
    visitors,
  };
}

export async function getVisitorTimeline(visitorId: string) {
  const collection = await getActivityCollection();
  const query = { visitorId, occurredAt: { $gte: activityCutoff() } };
  const [events, total] = await Promise.all([
    collection.find(query).sort({ occurredAt: -1 }).limit(500).toArray(),
    collection.countDocuments(query),
  ]);
  return { events, total };
}
