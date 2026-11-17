import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getFormsCollection, serializeForm } from "@/lib/admin/forms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };
const pageSizes = [10, 20, 50] as const;

export async function GET(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    }

    const requestedPage = Number.parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const requestedSize = Number.parseInt(request.nextUrl.searchParams.get("pageSize") || "20", 10);
    const pageSize = pageSizes.includes(requestedSize as (typeof pageSizes)[number])
      ? requestedSize
      : 20;
    const requestedType = request.nextUrl.searchParams.get("type") || "all";
    const type = requestedType.length <= 100 ? requestedType : "all";

    const collection = await getFormsCollection();
    const query = type === "all" ? {} : { type };
    const [rawTypes, total] = await Promise.all([
      collection.distinct("type"),
      collection.countDocuments(query),
    ]);
    const types = rawTypes
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(
      totalPages,
      Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
    );
    const records = await collection
      .find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      forms: records.map(serializeForm),
      types,
      page,
      pageSize,
      total,
      totalPages,
    }, { headers: noStore });
  } catch (error) {
    console.error("Admin form submissions listing failed", error);
    return NextResponse.json(
      { error: "Could not load form submissions" },
      { status: 503, headers: noStore },
    );
  }
}
