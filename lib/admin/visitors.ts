import { activityCutoff, getActivityCollection, type ActivityEvent } from "@/lib/analytics";

export type VisitorFilters = {
  range: 1 | 7 | 15;
  page: number;
  segment: "all" | "new" | "returning";
  minPageViews: number;
  minFormStarts: number;
  minFormSubmits: number;
  minTimeSeconds: number;
  device: "all" | ActivityEvent["device"];
  sort: "recent" | "views" | "time" | "forms";
};
export const VISITORS_PER_PAGE = 20;
export type VisitorSummary = Awaited<ReturnType<typeof getVisitorOverview>>["visitors"][number];

type VisitorRow = {
  _id: string;
  lastSeen: Date;
  firstSeen: Date;
  sessions: string[];
  events: number;
  forms: number;
  pageViews: number;
  formStarts: number;
  timeSpentMs: number;
  country: string | null;
  city: string | null;
  ip: string | null;
  device: ActivityEvent["device"];
};

export async function getVisitorOverview(filters: VisitorFilters) {
  const collection = await getActivityCollection();
  const since = new Date(Math.max(activityCutoff().getTime(), Date.now() - filters.range * 86400000));
  const base = { occurredAt: { $gte: since } };

  const visitorGroups = [
    { $match: base },
    { $sort: { occurredAt: -1, _id: -1 } },
    { $group: {
      _id: "$visitorId",
      lastSeen: { $first: "$occurredAt" },
      firstSeen: { $min: "$occurredAt" },
      sessions: { $addToSet: "$sessionId" },
      events: { $sum: 1 },
      pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
      formStarts: { $sum: { $cond: [{ $eq: ["$type", "form_start"] }, 1, 0] } },
      forms: { $sum: { $cond: [{ $eq: ["$type", "form_submit"] }, 1, 0] } },
      timeSpentMs: { $sum: { $ifNull: ["$durationMs", 0] } },
      country: { $first: "$country" },
      city: { $first: "$city" },
      ip: { $first: "$ip" },
      device: { $first: "$device" },
    } },
  ];
  const filtered: Record<string, unknown> = {};
  if (filters.segment === "new") filtered["sessions.1"] = { $exists: false };
  if (filters.segment === "returning") filtered["sessions.1"] = { $exists: true };
  if (filters.minPageViews) filtered.pageViews = { $gte: filters.minPageViews };
  if (filters.minFormStarts) filtered.formStarts = { $gte: filters.minFormStarts };
  if (filters.minFormSubmits) filtered.forms = { $gte: filters.minFormSubmits };
  if (filters.minTimeSeconds) filtered.timeSpentMs = { $gte: filters.minTimeSeconds * 1000 };
  if (filters.device !== "all") filtered.device = filters.device;
  const sortField = { recent: "lastSeen", views: "pageViews", time: "timeSpentMs", forms: "forms" }[filters.sort];

  const [counts, filteredPage] = await Promise.all([
    collection.aggregate<{ visitors: number; returning: number; sessions: number; pageViews: number; clicks: number; formStarts: number; forms: number; timeSpentMs: number }>([
      { $match: base },
      { $group: {
        _id: "$visitorId",
        sessions: { $addToSet: "$sessionId" },
        pageViews: { $sum: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
        clicks: { $sum: { $cond: [{ $eq: ["$type", "click"] }, 1, 0] } },
        formStarts: { $sum: { $cond: [{ $eq: ["$type", "form_start"] }, 1, 0] } },
        forms: { $sum: { $cond: [{ $eq: ["$type", "form_submit"] }, 1, 0] } },
        timeSpentMs: { $sum: { $ifNull: ["$durationMs", 0] } },
      } },
      { $group: {
        _id: null,
        visitors: { $sum: 1 },
        returning: { $sum: { $cond: [{ $gt: [{ $size: "$sessions" }, 1] }, 1, 0] } },
        sessions: { $sum: { $size: "$sessions" } },
        pageViews: { $sum: "$pageViews" },
        clicks: { $sum: "$clicks" },
        formStarts: { $sum: "$formStarts" },
        forms: { $sum: "$forms" },
        timeSpentMs: { $sum: "$timeSpentMs" },
      } },
    ]).toArray(),
    collection.aggregate<{ rows: VisitorRow[]; total: { count: number }[] }>([
      ...visitorGroups,
      { $match: filtered },
      { $facet: {
        rows: [
          { $sort: { [sortField]: -1, _id: 1 } },
          { $skip: (filters.page - 1) * VISITORS_PER_PAGE },
          { $limit: VISITORS_PER_PAGE },
        ],
        total: [{ $count: "count" }],
      } },
    ]).toArray(),
  ]);

  const visitors = filteredPage[0]?.rows || [];
  const totalVisitors = filteredPage[0]?.total[0]?.count || 0;

  const names = visitors.length ? await collection.aggregate<{ _id: string; name: string; email?: string; phone?: string }>([
    { $match: { visitorId: { $in: visitors.map((visitor) => visitor._id) }, type: "form_submit", "lead.name": { $exists: true, $ne: "" }, occurredAt: { $gte: activityCutoff() } } },
    { $sort: { occurredAt: -1 } },
    { $group: { _id: "$visitorId", name: { $first: "$lead.name" }, email: { $first: "$lead.email" }, phone: { $first: "$lead.phone" } } },
  ]).toArray() : [];
  const nameById = new Map(names.map((item) => [item._id, item]));

  return {
    counts: counts[0] || { visitors: 0, returning: 0, sessions: 0, pageViews: 0, clicks: 0, formStarts: 0, forms: 0, timeSpentMs: 0 },
    totalVisitors,
    visitors: visitors.map((visitor) => ({
      id: visitor._id,
      name: nameById.get(visitor._id)?.name || null,
      email: nameById.get(visitor._id)?.email || null,
      phone: nameById.get(visitor._id)?.phone || null,
      lastSeen: visitor.lastSeen.toISOString(),
      firstSeen: visitor.firstSeen.toISOString(),
      sessions: visitor.sessions.length,
      events: visitor.events,
      forms: visitor.forms,
      pageViews: visitor.pageViews,
      formStarts: visitor.formStarts,
      timeSpentMs: visitor.timeSpentMs,
      country: visitor.country,
      city: visitor.city || null,
      ip: visitor.ip,
      device: visitor.device,
    })),
  };
}
