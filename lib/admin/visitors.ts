import { activityCutoff, getActivityCollection, type ActivityEvent } from "@/lib/analytics";

export type VisitorFilters = { range: 1 | 7 | 15; page: number };
export const VISITORS_PER_PAGE = 20;
export type VisitorSummary = Awaited<ReturnType<typeof getVisitorOverview>>["visitors"][number];

type VisitorRow = {
  _id: string;
  lastSeen: Date;
  firstSeen: Date;
  sessions: string[];
  events: number;
  forms: number;
  country: string | null;
  ip: string | null;
  device: ActivityEvent["device"];
};

export async function getVisitorOverview(filters: VisitorFilters) {
  const collection = await getActivityCollection();
  const since = new Date(Math.max(activityCutoff().getTime(), Date.now() - filters.range * 86400000));
  const base = { occurredAt: { $gte: since } };

  const [counts, visitors] = await Promise.all([
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
    collection.aggregate<VisitorRow>([
      { $match: base },
      { $sort: { occurredAt: -1, _id: -1 } },
      { $group: {
        _id: "$visitorId",
        lastSeen: { $first: "$occurredAt" },
        firstSeen: { $min: "$occurredAt" },
        sessions: { $addToSet: "$sessionId" },
        events: { $sum: 1 },
        forms: { $sum: { $cond: [{ $eq: ["$type", "form_submit"] }, 1, 0] } },
        country: { $first: "$country" },
        ip: { $first: "$ip" },
        device: { $first: "$device" },
      } },
      { $sort: { lastSeen: -1, _id: 1 } },
      { $skip: (filters.page - 1) * VISITORS_PER_PAGE },
      { $limit: VISITORS_PER_PAGE },
    ]).toArray(),
  ]);

  const names = visitors.length ? await collection.aggregate<{ _id: string; name: string; email?: string; phone?: string }>([
    { $match: { visitorId: { $in: visitors.map((visitor) => visitor._id) }, type: "form_submit", "lead.name": { $exists: true, $ne: "" }, occurredAt: { $gte: activityCutoff() } } },
    { $sort: { occurredAt: -1 } },
    { $group: { _id: "$visitorId", name: { $first: "$lead.name" }, email: { $first: "$lead.email" }, phone: { $first: "$lead.phone" } } },
  ]).toArray() : [];
  const nameById = new Map(names.map((item) => [item._id, item]));

  return {
    counts: counts[0] || { visitors: 0, returning: 0, pageViews: 0, clicks: 0, formStarts: 0, forms: 0 },
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
      country: visitor.country,
      ip: visitor.ip,
      device: visitor.device,
    })),
  };
}
