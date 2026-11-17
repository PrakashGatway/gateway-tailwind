import { NextRequest, NextResponse } from "next/server";
import { Binary } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getFormsCollection, parseFormId } from "@/lib/admin/forms";

export const runtime = "nodejs";

function findBinary(value: unknown, depth = 0): Buffer | null {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Binary) {
    return Buffer.from(value.buffer.subarray(0, value.position));
  }
  if (!value || typeof value !== "object" || depth >= 4) return null;

  const candidate = value as Record<string, unknown>;
  if (candidate.type === "Buffer" && Array.isArray(candidate.data)) {
    const bytes = candidate.data.filter(
      (item): item is number => typeof item === "number" && Number.isInteger(item) && item >= 0 && item <= 255,
    );
    return Buffer.from(bytes);
  }

  for (const child of Object.values(candidate)) {
    const bytes = findBinary(child, depth + 1);
    if (bytes) return bytes;
  }
  return null;
}

function metadataString(record: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const value = record[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }

    const id = parseFormId((await params).id);
    const field = request.nextUrl.searchParams.get("field") || "";
    if (!id || !field || field.length > 100 || field === "_id" || field === "__v" || field.includes(".") || field.startsWith("$")) {
      return NextResponse.json({ error: "Invalid attachment reference" }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    const record = await (await getFormsCollection()).findOne({ _id: id });
    if (!record || !(field in record)) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }

    const bytes = findBinary(record[field]);
    if (!bytes) {
      return NextResponse.json({ error: "This attachment is stored as a file link" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    if (!bytes.length) {
      return NextResponse.json({ error: "Attachment is empty" }, { status: 404, headers: { "Cache-Control": "no-store" } });
    }
    if (bytes.length > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "Attachment exceeds the 50 MB preview limit" }, { status: 413, headers: { "Cache-Control": "no-store" } });
    }

    const value = record[field];
    const nested = value && typeof value === "object" ? value as Record<string, unknown> : {};
    const filename = metadataString(nested, ["originalname", "originalName", "fileName", "filename", "name"])
      || metadataString(record, ["originalname", "originalName", "fileName", "filename"])
      || "attachment";
    const requestedMime = metadataString(nested, ["mimetype", "mimeType", "contentType"])
      || metadataString(record, ["mimetype", "mimeType", "contentType"]);
    const extension = filename.toLowerCase().split(".").pop();
    const inferredMime =
      extension === "pdf" ? "application/pdf"
      : extension === "png" ? "image/png"
      : extension === "jpg" || extension === "jpeg" ? "image/jpeg"
      : extension === "gif" ? "image/gif"
      : extension === "webp" ? "image/webp"
      : "application/octet-stream";
    const previewMime = /^(application\/pdf|image\/(png|jpeg|gif|webp))$/i.test(requestedMime)
      ? requestedMime
      : inferredMime;
    const canPreview = /^(application\/pdf|image\/(png|jpeg|gif|webp))$/i.test(previewMime);
    const download = request.nextUrl.searchParams.get("download") === "1";
    const safeName = filename.replace(/[\r\n"]/g, "_").slice(0, 180) || "attachment";
    const disposition = download || !canPreview ? "attachment" : "inline";

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": previewMime,
        "Content-Disposition": disposition + "; filename=\"" + safeName + "\"; filename*=UTF-8''" + encodeURIComponent(safeName),
        "Content-Length": String(bytes.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox",
      },
    });
  } catch (error) {
    console.error("Admin attachment retrieval failed", error);
    return NextResponse.json(
      { error: "Could not retrieve attachment" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
