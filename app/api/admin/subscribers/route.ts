import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getSubscribersCollection, serializeSubscriber, subscriberFilter } from "@/lib/admin/subscribers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const sizes = [10, 20, 50] as const;

export async function GET(request: NextRequest) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  try {
    const params = request.nextUrl.searchParams;
    const requestedPage = Number.parseInt(params.get("page") || "1", 10);
    const requestedSize = Number.parseInt(params.get("pageSize") || "20", 10);
    const pageSize = sizes.includes(requestedSize as (typeof sizes)[number]) ? requestedSize : 20;
    const search = params.get("search")?.trim().slice(0, 100) || "";
    const status = params.get("status") || "all";
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const query = subscriberFilter({ search, status, from, to });
    const collection = await getSubscribersCollection();
    const total = await collection.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
    const records = await collection.find(query).sort({ subscribedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray();
    const [subscribed, unsubscribed] = await Promise.all([collection.countDocuments({ status: "subscribed" }), collection.countDocuments({ status: "unsubscribed" })]);
    return NextResponse.json({ subscribers: records.map(serializeSubscriber), page, pageSize, total, totalPages, counts: { subscribed, unsubscribed } }, { headers: noStore });
  } catch (error) {
    console.error("Admin subscriber listing failed", error);
    return NextResponse.json({ error: "Could not load subscribers" }, { status: 503, headers: noStore });
  }
}
