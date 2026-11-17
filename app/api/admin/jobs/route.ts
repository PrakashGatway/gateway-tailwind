import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getJobsCollection, parseJobInput, serializeJob } from "@/lib/admin/jobs";

export const runtime = "nodejs";
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  if (!await getCurrentAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  try {
    const jobs = await (await getJobsCollection())
      .find({})
      .sort({ _id: -1 })
      .limit(500)
      .toArray();
    return NextResponse.json({ jobs: jobs.map(serializeJob) }, { headers: noStore });
  } catch (error) {
    console.error("Admin jobs listing failed", error);
    return NextResponse.json({ error: "Could not load jobs" }, { status: 503, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  if (!await getCurrentAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: noStore });
  }
  if (Number(request.headers.get("content-length") || 0) > 100_000) {
    return NextResponse.json({ error: "Job details are too large" }, { status: 413, headers: noStore });
  }

  let job;
  try {
    job = parseJobInput(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid job details" },
      { status: 400, headers: noStore },
    );
  }

  try {
    const record = { _id: new ObjectId(), ...job, __v: 0 };
    await (await getJobsCollection()).insertOne(record);
    return NextResponse.json({ job: serializeJob(record) }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("Admin job creation failed", error);
    return NextResponse.json({ error: "Could not create job" }, { status: 503, headers: noStore });
  }
}
