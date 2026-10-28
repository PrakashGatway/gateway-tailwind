import { activityCutoff, getActivityCollection, type ClickKind } from "@/lib/analytics";

export type ButtonFilters = {
  range: 1 | 7 | 15;
  kind: "all" | ClickKind;
  route: string;
  search: string;
  page: number;
};

export const BUTTONS_PER_PAGE = 25;

type Row = { _id: { path: string; label: string; target: string; kind: ClickKind }; clicks: number; visitors: number; lastAt: Date };
type FacetResult = {
  summary: { clicks: number; visitors: number; whatsapp: number; phone: number }[];
  kinds: { _id: ClickKind; clicks: number }[];
  routes: { _id: string; clicks: number }[];
  trend: { _id: string; clicks: number }[];
  buttons: Row[];
  buttonTotal: { count: number }[];
};

function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export async function getButtonAnalytics(filters: ButtonFilters) {
  const collection = await getActivityCollection();
  const since = new Date(Math.max(activityCutoff().getTime(), Date.now() - filters.range * 86400000));
  const base = { type: "click", occurredAt: { $gte: since } };
  const match: Record<string, unknown> = {};
  if (filters.kind !== "all") match.resolvedKind = filters.kind;
  if (filters.route) match.path = filters.route;
  if (filters.search) {
    const regex = escapeRegex(filters.search);
    match.$or = [{ label: { $regex: regex, $options: "i" } }, { clickTarget: { $regex: regex, $options: "i" } }];
  }
  const format = filters.range === 1 ? "%Y-%m-%d %H" : "%Y-%m-%d";
  const [facets, routeOptions] = await Promise.all([
    collection.aggregate<FacetResult>([
      { $match: base },
      { $addFields: { resolvedKind: { $ifNull: ["$clickKind", { $switch: {
        branches: [
          { case: { $regexMatch: { input: { $ifNull: ["$label", ""] }, regex: "whatsapp|wa\\.me", options: "i" } }, then: "whatsapp" },
          { case: { $regexMatch: { input: { $ifNull: ["$label", ""] }, regex: "phone|call|\\[number\\]", options: "i" } }, then: "phone" },
        ], default: "button",
      } }] } } },
      { $match: match },
      { $facet: {
        summary: [
          { $group: { _id: "$visitorId", clicks: { $sum: 1 }, whatsapp: { $sum: { $cond: [{ $eq: ["$resolvedKind", "whatsapp"] }, 1, 0] } }, phone: { $sum: { $cond: [{ $eq: ["$resolvedKind", "phone"] }, 1, 0] } } } },
          { $group: { _id: null, clicks: { $sum: "$clicks" }, visitors: { $sum: 1 }, whatsapp: { $sum: "$whatsapp" }, phone: { $sum: "$phone" } } },
        ],
        kinds: [{ $group: { _id: "$resolvedKind", clicks: { $sum: 1 } } }, { $sort: { clicks: -1 } }],
        routes: [{ $group: { _id: "$path", clicks: { $sum: 1 } } }, { $sort: { clicks: -1, _id: 1 } }, { $limit: 8 }],
        trend: [{ $group: { _id: { $dateToString: { format, date: "$occurredAt", timezone: "Asia/Kolkata" } }, clicks: { $sum: 1 } } }, { $sort: { _id: 1 } }],
        buttons: [
          { $group: { _id: { path: "$path", label: "$label", target: { $ifNull: ["$clickTarget", ""] }, kind: "$resolvedKind", visitorId: "$visitorId" }, clicks: { $sum: 1 }, lastAt: { $max: "$occurredAt" } } },
          { $group: { _id: { path: "$_id.path", label: "$_id.label", target: "$_id.target", kind: "$_id.kind" }, clicks: { $sum: "$clicks" }, visitors: { $sum: 1 }, lastAt: { $max: "$lastAt" } } },
          { $sort: { clicks: -1, lastAt: -1 } },
          { $skip: (filters.page - 1) * BUTTONS_PER_PAGE },
          { $limit: BUTTONS_PER_PAGE },
        ],
        buttonTotal: [
          { $group: { _id: { path: "$path", label: "$label", target: { $ifNull: ["$clickTarget", ""] }, kind: "$resolvedKind" } } },
          { $count: "count" },
        ],
      } },
    ], { allowDiskUse: true }).toArray(),
    collection.aggregate<{ _id: string; clicks: number }>([
      { $match: base }, { $group: { _id: "$path", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } }, { $limit: 150 },
    ]).toArray(),
  ]);
  const result = facets[0];
  return {
    summary: result?.summary[0] || { clicks: 0, visitors: 0, whatsapp: 0, phone: 0 },
    kinds: result?.kinds || [], routes: result?.routes || [], trend: result?.trend || [],
    rows: result?.buttons || [], total: result?.buttonTotal[0]?.count || 0,
    routeOptions: routeOptions.map((row) => row._id),
  };
}
