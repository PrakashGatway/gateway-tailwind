import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getFormsCollection, parseFormId } from "@/lib/admin/forms";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
    }
    if (request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
    }

    const id = parseFormId((await params).id);
    if (!id) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400, headers: noStore });
    }

    const result = await (await getFormsCollection()).deleteOne({ _id: id });
    return result.deletedCount
      ? NextResponse.json({ success: true }, { headers: noStore })
      : NextResponse.json({ error: "Submission not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin form submission deletion failed", error);
    return NextResponse.json(
      { error: "Could not delete form submission" },
      { status: 503, headers: noStore },
    );
  }
}
