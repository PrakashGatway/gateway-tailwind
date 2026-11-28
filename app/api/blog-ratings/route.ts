import { NextRequest, NextResponse } from "next/server";
import { cleanRating, cleanSlug, getRatingsCollection } from "@/lib/admin/ratings";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  try {
    const slug = cleanSlug(request.nextUrl.searchParams.get("slug"));
    const rows = await (await getRatingsCollection()).aggregate<{ _id: null; average: number; total: number }>([{ $match: { slug } }, { $group: { _id: null, average: { $avg: "$rating" }, total: { $sum: 1 } } }]).toArray();
    return NextResponse.json({ rating: rows[0]?.average ? Math.round(rows[0].average * 10) / 10 : 5 }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ rating: 5 }, { headers: { "Cache-Control": "no-store" } }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); const slug = cleanSlug(body?.slug); const rating = cleanRating(body?.rating); const title = typeof body?.title === "string" ? body.title.trim().slice(0, 180) : slug;
    await (await getRatingsCollection()).insertOne({ _id: new (await import("mongodb")).ObjectId(), slug, title, rating, createdAt: new Date(), ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save rating" }, { status: 400 }); }
}
