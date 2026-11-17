import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Filter } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  getStudentsCollection,
  parseStudentInput,
  serializeStudent,
  type StudentRecord,
} from "@/lib/admin/students";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const pageSizes = [10, 20, 50] as const;

function escapeRegex(value: string) {
  const specialCharacters = ".^$*+?()[]{}|\\";
  return value
    .split("")
    .map((character) => specialCharacters.includes(character) ? "\\" + character : character)
    .join("");
}

export async function GET(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    }
    const params = request.nextUrl.searchParams;
    const requestedPage = Number.parseInt(params.get("page") || "1", 10);
    const requestedSize = Number.parseInt(params.get("pageSize") || "20", 10);
    const pageSize = pageSizes.includes(requestedSize as (typeof pageSizes)[number]) ? requestedSize : 20;
    const type = (params.get("type") || "all").slice(0, 60);
    const courseName = (params.get("courseName") || "all").slice(0, 80);
    const search = (params.get("search") || "").trim().slice(0, 100);

    const query: Filter<StudentRecord> = {};
    if (type !== "all") query.type = type;
    if (courseName !== "all") query.courseName = courseName;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: pattern }, { content: pattern }, { courseName: pattern }, { univercity: pattern }];
    }

    const collection = await getStudentsCollection();
    const [rawTypes, rawCourses, total] = await Promise.all([
      collection.distinct("type"),
      collection.distinct("courseName"),
      collection.countDocuments(query),
    ]);
    const types = rawTypes.filter((item): item is string => typeof item === "string" && item.trim()).sort();
    const courses = rawCourses.filter((item): item is string => typeof item === "string" && item.trim()).sort();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
    const students = await collection
      .find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      students: students.map(serializeStudent),
      types,
      courses,
      page,
      pageSize,
      total,
      totalPages,
    }, { headers: noStore });
  } catch (error) {
    console.error("Admin students listing failed", error);
    return NextResponse.json({ error: "Could not load students" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    }
    if (request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
    }
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
    const id = new ObjectId().toHexString();
    const record: StudentRecord = { _id: id, id, ...input, __v: 0 };
    await (await getStudentsCollection()).insertOne(record);
    return NextResponse.json({ student: serializeStudent(record) }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Admin student creation failed", error);
    return NextResponse.json({ error: "Could not create student" }, { status: 503, headers: noStore });
  }
}
