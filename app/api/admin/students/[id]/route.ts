import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
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
  if (Number(request.headers.get("content-length") || 0) > 20_000) {
    return NextResponse.json({ error: "Student details are too large" }, { status: 413, headers: noStore });
  }

  let input;
  try {
    input = parseStudentInput(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid student details" },
      { status: 400, headers: noStore },
    );
  }

  try {
    const collection = await getStudentsCollection();
    const filter = studentIdFilter(id);
    const result = await collection.updateOne(filter, { $set: input });
    if (!result.matchedCount) {
      return NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
    }
    const student = await collection.findOne(filter);
    return student
      ? NextResponse.json({ student: serializeStudent(student) }, { headers: noStore })
      : NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin student update failed", error);
    return NextResponse.json({ error: "Could not update student" }, { status: 503, headers: noStore });
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
    const result = await (await getStudentsCollection()).deleteOne(studentIdFilter(id));
    return result.deletedCount
      ? NextResponse.json({ success: true }, { headers: noStore })
      : NextResponse.json({ error: "Student not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin student deletion failed", error);
    return NextResponse.json({ error: "Could not delete student" }, { status: 503, headers: noStore });
  }
}
