import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { destroyStudentImage, uploadStudentImage } from "@/lib/cloudinary";
import {
  getStudentsCollection,
  parseStudentId,
  parseStudentInput,
  serializeStudent,
  studentIdFilter,
} from "@/lib/admin/students";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

async function authorize(request: NextRequest) {
  if (!await getCurrentAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }
  if (request.method !== "GET" && request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseStudentId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid student ID" }, { status: 400, headers: noStore });

  try {
    const student = await (await getStudentsCollection()).findOne(studentIdFilter(id));
    return student
      ? NextResponse.json({ student: serializeStudent(student) }, { headers: noStore })
      : NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin student lookup failed", error);
    return NextResponse.json({ error: "Could not load student" }, { status: 503, headers: noStore });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseStudentId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid student ID" }, { status: 400, headers: noStore });
  if (Number(request.headers.get("content-length") || 0) > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 8 MB" }, { status: 413, headers: noStore });
  }

  let input;
  let file: File | null = null;
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      const raw = form.get("student");
      const image = form.get("image");
      if (typeof raw !== "string" || raw.length > 12000) throw new Error("Invalid student details");
      if (image !== null && !(image instanceof File)) throw new Error("Invalid image upload");
      input = parseStudentInput(JSON.parse(raw));
      file = image instanceof File && image.size ? image : null;
    } else {
      input = parseStudentInput(await request.json());
    }
    if (file && (!file.size || file.size > 8 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))) {
      throw new Error("Use a JPG, PNG, WebP, or AVIF image under 8 MB");
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid student details" },
      { status: 400, headers: noStore },
    );
  }

  let uploaded: Awaited<ReturnType<typeof uploadStudentImage>> | null = null;
  let saved = false;
  try {
    const collection = await getStudentsCollection();
    const filter = studentIdFilter(id);
    const existing = await collection.findOne(filter);
    if (!existing) return NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
    if (!file && !input.image) input.image = existing.image || "";
    if (!input.image && !file) return NextResponse.json({ error: "Choose an image to upload or provide an image URL" }, { status: 400, headers: noStore });
    if (file) uploaded = await uploadStudentImage(file);
    const result = await collection.updateOne(filter, { $set: { ...input, ...(uploaded || {}) } });
    if (!result.matchedCount) throw new Error("Student changed while editing");
    saved = true;
    if (uploaded && existing.imagePublicId) {
      await destroyStudentImage(existing.imagePublicId).catch((error) => console.error("Could not remove replaced student image", error));
    }
    const student = await collection.findOne(filter);
    return student
      ? NextResponse.json({ student: serializeStudent(student) }, { headers: noStore })
      : NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
  } catch (error) {
    if (uploaded && !saved) await destroyStudentImage(uploaded.imagePublicId).catch((cleanupError) => console.error("Could not clean failed student image upload", cleanupError));
    console.error("Admin student update failed", error);
    return NextResponse.json({ error: error instanceof Error && error.message === "Student changed while editing" ? error.message : "Could not update student" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseStudentId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid student ID" }, { status: 400, headers: noStore });

  try {
    const collection = await getStudentsCollection();
    const filter = studentIdFilter(id);
    const student = await collection.findOne(filter);
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
    const result = await collection.deleteOne(filter);
    if (!result.deletedCount) return NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
    if (student.imagePublicId) await destroyStudentImage(student.imagePublicId).catch((error) => console.error("Could not remove deleted student image", error));
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (error) {
    console.error("Admin student deletion failed", error);
    return NextResponse.json({ error: "Could not delete student" }, { status: 503, headers: noStore });
  }
}
