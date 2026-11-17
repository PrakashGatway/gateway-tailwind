import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  getMembersCollection,
  memberIdFilter,
  parseMemberId,
  parseMemberInput,
  serializeMember,
} from "@/lib/admin/members";

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
  const id = parseMemberId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid member ID" }, { status: 400, headers: noStore });

  try {
    const member = await (await getMembersCollection()).findOne(memberIdFilter(id));
    return member
      ? NextResponse.json({ member: serializeMember(member) }, { headers: noStore })
      : NextResponse.json({ error: "Member not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin member lookup failed", error);
    return NextResponse.json({ error: "Could not load member" }, { status: 503, headers: noStore });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseMemberId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid member ID" }, { status: 400, headers: noStore });
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

  try {
    const collection = await getMembersCollection();
    const filter = memberIdFilter(id);
    const result = await collection.updateOne(filter, { $set: input });
    if (!result.matchedCount) {
      return NextResponse.json({ error: "Member not found" }, { status: 404, headers: noStore });
    }
    const member = await collection.findOne(filter);
    return member
      ? NextResponse.json({ member: serializeMember(member) }, { headers: noStore })
      : NextResponse.json({ error: "Member not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin member update failed", error);
    return NextResponse.json({ error: "Could not update member" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseMemberId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid member ID" }, { status: 400, headers: noStore });

  try {
    const result = await (await getMembersCollection()).deleteOne(memberIdFilter(id));
    return result.deletedCount
      ? NextResponse.json({ success: true }, { headers: noStore })
      : NextResponse.json({ error: "Member not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin member deletion failed", error);
    return NextResponse.json({ error: "Could not delete member" }, { status: 503, headers: noStore });
  }
}
