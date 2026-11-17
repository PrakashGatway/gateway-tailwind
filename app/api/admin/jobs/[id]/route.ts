import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getJobsCollection, parseJobId, serializeJob } from "@/lib/admin/jobs";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

async function authorize(request: NextRequest) {
  if (!await getCurrentAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }
  if (request.method === "DELETE" && request.headers.get("sec-fetch-site") === "cross-site") {
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

  const id = parseJobId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid job ID" }, { status: 400, headers: noStore });

  try {
    const job = await (await getJobsCollection()).findOne({ _id: id });
    return job
      ? NextResponse.json({ job: serializeJob(job) }, { headers: noStore })
      : NextResponse.json({ error: "Job not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin job lookup failed", error);
    return NextResponse.json({ error: "Could not load job" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;

  const id = parseJobId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid job ID" }, { status: 400, headers: noStore });

  try {
    const result = await (await getJobsCollection()).deleteOne({ _id: id });
    return result.deletedCount
      ? NextResponse.json({ success: true }, { headers: noStore })
      : NextResponse.json({ error: "Job not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin job deletion failed", error);
    return NextResponse.json({ error: "Could not delete job" }, { status: 503, headers: noStore });
  }
}
