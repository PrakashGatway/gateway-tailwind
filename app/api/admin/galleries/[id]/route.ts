import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { galleryIdFilter, getGalleriesCollection, parseGalleryId, parseGalleryInput, serializeGallery } from "@/lib/admin/galleries";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };
async function authorize(request: NextRequest) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (request.method !== "GET" && request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request); if (denied) return denied;
  const id = parseGalleryId((await params).id); if (!id) return NextResponse.json({ error: "Invalid gallery ID" }, { status: 400, headers: noStore });
  try {
    const item = await (await getGalleriesCollection()).findOne(galleryIdFilter(id));
    return item ? NextResponse.json({ gallery: serializeGallery(item) }, { headers: noStore }) : NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
  } catch (error) { console.error("Admin gallery lookup failed", error); return NextResponse.json({ error: "Could not load gallery item" }, { status: 503, headers: noStore }); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request); if (denied) return denied;
  const id = parseGalleryId((await params).id); if (!id) return NextResponse.json({ error: "Invalid gallery ID" }, { status: 400, headers: noStore });
  let input;
  try { input = parseGalleryInput(await request.json()); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid gallery details" }, { status: 400, headers: noStore }); }
  try {
    const collection = await getGalleriesCollection(); const filter = galleryIdFilter(id);
    const result = await collection.updateOne(filter, { $set: input });
    if (!result.matchedCount) return NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
    const item = await collection.findOne(filter);
    return item ? NextResponse.json({ gallery: serializeGallery(item) }, { headers: noStore }) : NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
  } catch (error) { console.error("Admin gallery update failed", error); return NextResponse.json({ error: "Could not update gallery item" }, { status: 503, headers: noStore }); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request); if (denied) return denied;
  const id = parseGalleryId((await params).id); if (!id) return NextResponse.json({ error: "Invalid gallery ID" }, { status: 400, headers: noStore });
  try {
    const result = await (await getGalleriesCollection()).deleteOne(galleryIdFilter(id));
    return result.deletedCount ? NextResponse.json({ success: true }, { headers: noStore }) : NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
  } catch (error) { console.error("Admin gallery deletion failed", error); return NextResponse.json({ error: "Could not delete gallery item" }, { status: 503, headers: noStore }); }
}
