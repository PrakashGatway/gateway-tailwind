import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { galleryIdFilter, getGalleriesCollection, parseGalleryId, parseGalleryInput, serializeGallery } from "@/lib/admin/galleries";
import { destroyGalleryImage, uploadGalleryImage } from "@/lib/cloudinary";

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
  if (Number(request.headers.get("content-length") || 0) > 10 * 1024 * 1024) return NextResponse.json({ error: "Upload is too large" }, { status: 413, headers: noStore });
  let input;
  let file: File | null = null;
  try {
    const form = await request.formData();
    const raw = form.get("gallery");
    const image = form.get("image");
    if (typeof raw !== "string" || raw.length > 5000) throw new Error("Gallery details are required");
    input = parseGalleryInput(JSON.parse(raw));
    if (image !== null && !(image instanceof File)) throw new Error("Invalid image upload");
    if (image instanceof File && image.size) file = image;
    if (input.catogary === "video" && file) throw new Error("Video gallery items use a YouTube link");
  }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid gallery details" }, { status: 400, headers: noStore }); }
  if (file && (!file.size || file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image under 8 MB" }, { status: 400, headers: noStore });
  }
  let uploaded: Awaited<ReturnType<typeof uploadGalleryImage>> | null = null;
  let persisted = false;
  try {
    const collection = await getGalleriesCollection(); const filter = galleryIdFilter(id);
    const existing = await collection.findOne(filter);
    if (!existing) return NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
    if (input.catogary === "image" && existing.catogary !== "image" && !file) return NextResponse.json({ error: "Choose an image to upload" }, { status: 400, headers: noStore });
    if (file) uploaded = await uploadGalleryImage(file);
    const result = await collection.updateOne(filter, {
      $set: { ...input, ...(uploaded ? uploaded : {}) },
      ...(input.catogary === "video" ? { $unset: { mediaPublicId: "" } } : {}),
    });
    if (!result.matchedCount) {
      if (uploaded) await destroyGalleryImage(uploaded.mediaPublicId).catch((cleanupError) => console.error("Could not clean failed gallery replacement", cleanupError));
      uploaded = null;
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
    }
    persisted = true;
    const item = await collection.findOne(filter);
    if (existing.mediaPublicId && (uploaded || input.catogary === "video")) await destroyGalleryImage(existing.mediaPublicId).catch((error) => console.error("Could not remove replaced gallery image", error));
    return item ? NextResponse.json({ gallery: serializeGallery(item) }, { headers: noStore }) : NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
  } catch (error) {
    if (uploaded && !persisted) await destroyGalleryImage(uploaded.mediaPublicId).catch((cleanupError) => console.error("Could not clean failed gallery replacement", cleanupError));
    console.error("Admin gallery update failed", error); return NextResponse.json({ error: "Could not update gallery item" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await authorize(request); if (denied) return denied;
  const id = parseGalleryId((await params).id); if (!id) return NextResponse.json({ error: "Invalid gallery ID" }, { status: 400, headers: noStore });
  try {
    const collection = await getGalleriesCollection();
    const filter = galleryIdFilter(id);
    const item = await collection.findOne(filter);
    if (!item) return NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
    const result = await collection.deleteOne(filter);
    if (result.deletedCount && item.mediaPublicId) await destroyGalleryImage(item.mediaPublicId).catch((error) => console.error("Could not remove deleted gallery image", error));
    return result.deletedCount ? NextResponse.json({ success: true }, { headers: noStore }) : NextResponse.json({ error: "Gallery item not found" }, { status: 404, headers: noStore });
  } catch (error) { console.error("Admin gallery deletion failed", error); return NextResponse.json({ error: "Could not delete gallery item" }, { status: 503, headers: noStore }); }
}
