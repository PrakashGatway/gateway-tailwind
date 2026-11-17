import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Filter } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  getTestimonialsCollection,
  parseTestimonialInput,
  serializeTestimonial,
  type TestimonialRecord,
} from "@/lib/admin/testimonials";

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
    const status = params.get("status") || "all";
    const search = (params.get("search") || "").trim().slice(0, 100);

    const query: Filter<TestimonialRecord> = {};
    if (type !== "all") query.type = type;
    if (status === "active") query.status = true;
    if (status === "inactive") query.status = false;
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: pattern }, { content: pattern }, { univercity: pattern }, { university: pattern }];
    }

    const collection = await getTestimonialsCollection();
    const [rawTypes, total] = await Promise.all([
      collection.distinct("type"),
      collection.countDocuments(query),
    ]);
    const types = rawTypes
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
    const records = await collection
      .find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      testimonials: records.map(serializeTestimonial),
      types,
      page,
      pageSize,
      total,
      totalPages,
    }, { headers: noStore });
  } catch (error) {
    console.error("Admin testimonials listing failed", error);
    return NextResponse.json({ error: "Could not load testimonials" }, { status: 503, headers: noStore });
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
      return NextResponse.json({ error: "Testimonial content is too large" }, { status: 413, headers: noStore });
    }

    let input;
    try {
      input = parseTestimonialInput(await request.json());
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid testimonial details" },
        { status: 400, headers: noStore },
      );
    }

    const id = new ObjectId().toHexString();
    const record: TestimonialRecord = { _id: id, id, ...input, __v: 0 };
    await (await getTestimonialsCollection()).insertOne(record);
    return NextResponse.json(
      { testimonial: serializeTestimonial(record) },
      { status: 201, headers: noStore },
    );
  } catch (error) {
    console.error("Admin testimonial creation failed", error);
    return NextResponse.json({ error: "Could not create testimonial" }, { status: 503, headers: noStore });
  }
}
