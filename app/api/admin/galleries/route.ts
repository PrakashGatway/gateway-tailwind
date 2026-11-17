import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Filter } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getGalleriesCollection, parseGalleryInput, serializeGallery, type GalleryRecord } from "@/lib/admin/galleries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const pageSizes = [10, 20, 50] as const;
function escapeRegex(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export async function GET(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    const params = request.nextUrl.searchParams;
    const requestedPage = Number.parseInt(params.get("page") || "1", 10);
    const requestedSize = Number.parseInt(params.get("pageSize") || "20", 10);
    const pageSize = pageSizes.includes(requestedSize as (typeof pageSizes)[number]) ? requestedSize : 20;
    const category = (params.get("category") || "all").slice(0, 20);
    const status = params.get("status") || "all";
    const search = (params.get("search") || "").trim().slice(0, 100);
    const query: Filter<GalleryRecord> = {};
    if (category === "image" || category === "video") query.catogary = category;
    if (status === "active") query.Status = true;
    if (status === "inactive") query.Status = false;
    if (search) { const pattern = new RegExp(escapeRegex(search), "i"); query.$or = [{ title: pattern }, { mediaLink: pattern }]; }
    const collection = await getGalleriesCollection();
    const [categories, total] = await Promise.all([collection.distinct("catogary"), collection.countDocuments(query)]);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
    const items = await collection.find(query).sort({ _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray();
    return NextResponse.json({ galleries: items.map(serializeGallery), categories: categories.filter((x): x is string => typeof x === "string" && !!x).sort(), page, pageSize, total, totalPages }, { headers: noStore });
  } catch (error) {
    console.error("Admin galleries listing failed", error);
    return NextResponse.json({ error: "Could not load galleries" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
    let input;
    try { input = parseGalleryInput(await request.json()); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid gallery details" }, { status: 400, headers: noStore }); }
    const id = new ObjectId().toHexString();
    const record: GalleryRecord = { _id: id, id, ...input, __v: 0 };
    await (await getGalleriesCollection()).insertOne(record);
    return NextResponse.json({ gallery: serializeGallery(record) }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Admin gallery creation failed", error);
    return NextResponse.json({ error: "Could not create gallery item" }, { status: 503, headers: noStore });
  }
}
