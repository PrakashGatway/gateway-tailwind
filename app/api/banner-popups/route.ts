import { NextResponse } from "next/server";
import { getBannerCollection, serializeBanner } from "@/lib/admin/banners";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const collection = await getBannerCollection();
    const banners = await collection.find({ enabled: true, imageUrl: { $ne: "" } })
      .sort({ priority: -1, updatedAt: -1 }).limit(200).toArray();
    return NextResponse.json({ banners: banners.map(serializeBanner) }, { headers: noStore });
  } catch (error) {
    console.error("Banner listing failed", error);
    return NextResponse.json({ error: "Banners are unavailable" }, { status: 503, headers: noStore });
  }
}
