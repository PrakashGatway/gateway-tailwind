import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getBannerCollection, parseBannerInput, retryPendingImageDeletions, serializeBanner } from "@/lib/admin/banners";
import { destroyPopupBanner, uploadPopupBanner } from "@/lib/cloudinary";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  try {
    await retryPendingImageDeletions();
    const collection = await getBannerCollection();
    const records = await collection.find({}).sort({ updatedAt: -1 }).limit(200).toArray();
    return NextResponse.json({ banners: records.map(serializeBanner) }, { headers: noStore });
  } catch (error) {
    console.error("Admin banner listing failed", error);
    return NextResponse.json({ error: "Could not load banners" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  if (Number(request.headers.get("content-length") || 0) > 10 * 1024 * 1024) return NextResponse.json({ error: "Upload is too large" }, { status: 413, headers: noStore });

  let input;
  let file: File;
  try {
    const form = await request.formData();
    const raw = form.get("banner");
    const image = form.get("image");
    if (typeof raw !== "string" || raw.length > 12000 || !(image instanceof File)) throw new Error("Banner details and an image are required");
    input = parseBannerInput(JSON.parse(raw));
    file = image;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid banner details" }, { status: 400, headers: noStore });
  }
  if (!file.size || file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image under 8 MB" }, { status: 400, headers: noStore });
  }

  let uploaded: Awaited<ReturnType<typeof uploadPopupBanner>> | null = null;
  try {
    uploaded = await uploadPopupBanner(file);
    const now = new Date();
    const record = { _id: new ObjectId(), ...input, ...uploaded, createdAt: now, updatedAt: now };
    await (await getBannerCollection()).insertOne(record);
    return NextResponse.json({ banner: serializeBanner(record) }, { status: 201, headers: noStore });
  } catch (error) {
    if (uploaded) await destroyPopupBanner(uploaded.imagePublicId).catch((cleanupError) => console.error("Could not clean failed banner upload", cleanupError));
    console.error("Banner creation failed", error);
    return NextResponse.json({ error: "Could not save banner or upload image" }, { status: 503, headers: noStore });
  }
}
