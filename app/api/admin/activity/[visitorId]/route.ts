import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getCurrentAdmin } from "@/lib/admin/session";
import { activityCutoff, getActivityCollection } from "@/lib/analytics";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };
const uuidPattern = /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const PAGE_SIZE = 24;

export async function GET(request: NextRequest, { params }: { params: Promise<{ visitorId: string }> }) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  const { visitorId } = await params;
  if (!uuidPattern.test(visitorId)) return NextResponse.json({ error: "Invalid visitor" }, { status: 400, headers: noStore });

  const cutoff = activityCutoff();
  const cursor = request.nextUrl.searchParams.get("cursor");
  let olderThan: Record<string, unknown> = {};
  if (cursor) {
    const [time, id] = cursor.split("|");
    const date = new Date(time);
    if (!Number.isFinite(date.getTime()) || !/^[a-f\d]{24}$/i.test(id || "")) {
      return NextResponse.json({ error: "Invalid cursor" }, { status: 400, headers: noStore });
    }
    olderThan = { $or: [{ occurredAt: { $lt: date } }, { occurredAt: date, _id: { $lt: new Types.ObjectId(id) } }] };
  }

  const collection = await getActivityCollection();
  const rows = await collection.find({ visitorId, occurredAt: { $gte: cutoff }, ...olderThan })
    .sort({ occurredAt: -1, _id: -1 }).limit(PAGE_SIZE + 1).toArray();
  const page = rows.slice(0, PAGE_SIZE);
  const last = page.at(-1);
  return NextResponse.json({
    events: page.map((event) => ({
      id: String(event._id),
      type: event.type,
      path: event.path,
      label: event.label,
      occurredAt: event.occurredAt.toISOString(),
      sessionId: event.sessionId,
      country: event.country,
      city: event.city || null,
      ip: event.ip,
      lead: event.lead || null,
      durationMs: event.durationMs ?? null,
    })),
    nextCursor: rows.length > PAGE_SIZE && last ? `${last.occurredAt.toISOString()}|${String(last._id)}` : null,
  }, { headers: noStore });
}
