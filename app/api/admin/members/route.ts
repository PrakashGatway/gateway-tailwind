import { NextRequest, NextResponse } from "next/server";
import { ObjectId, type Filter } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  getMembersCollection,
  parseMemberInput,
  serializeMember,
  type MemberRecord,
} from "@/lib/admin/members";

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
    const search = (params.get("search") || "").trim().slice(0, 100);
    const query: Filter<MemberRecord> = {};
    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: pattern }, { content: pattern }];
    }

    const collection = await getMembersCollection();
    const total = await collection.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(totalPages, Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1));
    const members = await collection
      .find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    return NextResponse.json({
      members: members.map(serializeMember),
      page,
      pageSize,
      total,
      totalPages,
    }, { headers: noStore });
  } catch (error) {
    console.error("Admin members listing failed", error);
    return NextResponse.json({ error: "Could not load members" }, { status: 503, headers: noStore });
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
      return NextResponse.json({ error: "Member details are too large" }, { status: 413, headers: noStore });
    }

    let input;
    try {
      input = parseMemberInput(await request.json());
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid member details" },
        { status: 400, headers: noStore },
      );
    }

    const record = { _id: new ObjectId(), ...input, __v: 0 };
    await (await getMembersCollection()).insertOne(record);
    return NextResponse.json({ member: serializeMember(record) }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Admin member creation failed", error);
    return NextResponse.json({ error: "Could not create member" }, { status: 503, headers: noStore });
  }
}
