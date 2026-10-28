import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import { cancelImageDeletion, getBannerCollection, parseBannerInput, processImageDeletion, queueImageDeletion, serializeBanner } from "@/lib/admin/banners";
import { destroyPopupBanner, uploadPopupBanner } from "@/lib/cloudinary";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

function bannerId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null;
}

async function authorized(request: NextRequest) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  if (request.method !== "GET" && request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  }
  return null;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rejected = await authorized(request);
  if (rejected) return rejected;
  const id = bannerId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid banner ID" }, { status: 400, headers: noStore });
  const record = await (await getBannerCollection()).findOne({ _id: id });
  return record
    ? NextResponse.json({ banner: serializeBanner(record) }, { headers: noStore })
    : NextResponse.json({ error: "Banner not found" }, { status: 404, headers: noStore });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rejected = await authorized(request);
  if (rejected) return rejected;
  const id = bannerId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid banner ID" }, { status: 400, headers: noStore });
  if (Number(request.headers.get("content-length") || 0) > 10 * 1024 * 1024) return NextResponse.json({ error: "Upload is too large" }, { status: 413, headers: noStore });

  let input;
  let file: File | null = null;
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      const raw = form.get("banner");
      if (typeof raw !== "string" || raw.length > 12000) throw new Error("Invalid banner details");
      input = parseBannerInput(JSON.parse(raw));
      const image = form.get("image");
      if (image !== null && !(image instanceof File)) throw new Error("Invalid image upload");
      file = image;
    } else {
      const body = await request.json();
      input = parseBannerInput(body.banner);
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid banner details" }, { status: 400, headers: noStore });
  }
  if (file && (!file.size || file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP, or AVIF image under 8 MB" }, { status: 400, headers: noStore });
  }

  const collection = await getBannerCollection();
  const existing = await collection.findOne({ _id: id });
  if (!existing) return NextResponse.json({ error: "Banner not found" }, { status: 404, headers: noStore });

  let uploaded: Awaited<ReturnType<typeof uploadPopupBanner>> | null = null;
  let deletionTask: ObjectId | null = null;
  let saved = false;
  try {
    if (file) {
      uploaded = await uploadPopupBanner(file);
      deletionTask = await queueImageDeletion(existing.imagePublicId, id);
    }
    const updated = { ...input, ...(uploaded || {}), updatedAt: new Date() };
    const result = await collection.updateOne({ _id: id, imagePublicId: existing.imagePublicId }, { $set: updated });
    if (!result.matchedCount) throw new Error("Banner changed while editing");
    saved = true;
    let cleanupPending = false;
    if (deletionTask && uploaded) {
      try { await processImageDeletion(deletionTask, existing.imagePublicId); }
      catch (error) { cleanupPending = true; console.error("Banner replacement cleanup will retry", error); }
    }
    return NextResponse.json({ banner: serializeBanner({ ...existing, ...updated }), cleanupPending }, { headers: noStore });
  } catch (error) {
    if (!saved) {
      if (deletionTask) await cancelImageDeletion(deletionTask).catch((cleanupError) => console.error("Could not cancel banner cleanup task", cleanupError));
      if (uploaded) await destroyPopupBanner(uploaded.imagePublicId).catch((cleanupError) => console.error("Could not clean replacement image", cleanupError));
    }
    console.error("Banner update failed", error);
    return NextResponse.json({ error: error instanceof Error && error.message === "Banner changed while editing" ? error.message : "Could not update banner" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rejected = await authorized(request);
  if (rejected) return rejected;
  const id = bannerId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid banner ID" }, { status: 400, headers: noStore });
  const collection = await getBannerCollection();
  const existing = await collection.findOne({ _id: id });
  if (!existing) return NextResponse.json({ error: "Banner not found" }, { status: 404, headers: noStore });
  const task = await queueImageDeletion(existing.imagePublicId, id);
  try {
    const result = await collection.deleteOne({ _id: id, imagePublicId: existing.imagePublicId });
    if (!result.deletedCount) throw new Error("Banner changed before deletion");
  } catch (error) {
    await cancelImageDeletion(task).catch((cleanupError) => console.error("Could not cancel banner cleanup task", cleanupError));
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not delete banner" }, { status: 409, headers: noStore });
  }
  let cleanupPending = false;
  try { await processImageDeletion(task, existing.imagePublicId); }
  catch (error) { cleanupPending = true; console.error("Banner deletion cleanup will retry", error); }
  return NextResponse.json({ deleted: true, cleanupPending }, { headers: noStore });
}
