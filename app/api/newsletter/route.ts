import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSubscribersCollection, normalizeSubscriberEmail, serializeSubscriber, type SubscriberRecord } from "@/lib/admin/subscribers";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

function clientIp(request: NextRequest) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    if (Number(request.headers.get("content-length") || 0) > 2_000) return NextResponse.json({ error: "Request is too large" }, { status: 413, headers: noStore });
    const body = await request.json();
    const email = normalizeSubscriberEmail(body?.email);
    const now = new Date();
    const collection = await getSubscribersCollection();
    const existing = await collection.findOne({ email });
    if (existing?.status === "subscribed") return NextResponse.json({ success: true, alreadySubscribed: true }, { status: 200, headers: noStore });
    if (existing) {
      await collection.updateOne({ _id: existing._id }, { $set: { status: "subscribed", source: "footer", updatedAt: now, subscribedAt: now, ip: clientIp(request) } });
      return NextResponse.json({ success: true, subscriber: serializeSubscriber({ ...existing, status: "subscribed", source: "footer", updatedAt: now, subscribedAt: now }) }, { status: 200, headers: noStore });
    }
    const record: SubscriberRecord = { _id: new ObjectId(), email, status: "subscribed", source: "footer", subscribedAt: now, updatedAt: now, ip: clientIp(request) };
    await collection.insertOne(record);
    return NextResponse.json({ success: true, subscriber: serializeSubscriber(record) }, { status: 201, headers: noStore });
  } catch (error) {
    if (error instanceof Error && error.message === "Enter a valid email address") return NextResponse.json({ error: error.message }, { status: 400, headers: noStore });
    console.error("Newsletter subscription failed", error);
    return NextResponse.json({ error: "Could not subscribe right now" }, { status: 503, headers: noStore });
  }
}
