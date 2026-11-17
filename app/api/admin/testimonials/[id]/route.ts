import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import {
  getTestimonialsCollection,
  parseTestimonialId,
  parseTestimonialInput,
  serializeTestimonial,
  testimonialIdFilter,
} from "@/lib/admin/testimonials";

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
  const id = parseTestimonialId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400, headers: noStore });

  try {
    const record = await (await getTestimonialsCollection()).findOne(testimonialIdFilter(id));
    return record
      ? NextResponse.json({ testimonial: serializeTestimonial(record) }, { headers: noStore })
      : NextResponse.json({ error: "Testimonial not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin testimonial lookup failed", error);
    return NextResponse.json({ error: "Could not load testimonial" }, { status: 503, headers: noStore });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseTestimonialId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400, headers: noStore });
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

  try {
    const collection = await getTestimonialsCollection();
    const filter = testimonialIdFilter(id);
    const result = await collection.updateOne(filter, { $set: input });
    if (!result.matchedCount) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404, headers: noStore });
    }
    const record = await collection.findOne(filter);
    return record
      ? NextResponse.json({ testimonial: serializeTestimonial(record) }, { headers: noStore })
      : NextResponse.json({ error: "Testimonial not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin testimonial update failed", error);
    return NextResponse.json({ error: "Could not update testimonial" }, { status: 503, headers: noStore });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const rejected = await authorize(request);
  if (rejected) return rejected;
  const id = parseTestimonialId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400, headers: noStore });

  try {
    const result = await (await getTestimonialsCollection()).deleteOne(testimonialIdFilter(id));
    return result.deletedCount
      ? NextResponse.json({ success: true }, { headers: noStore })
      : NextResponse.json({ error: "Testimonial not found" }, { status: 404, headers: noStore });
  } catch (error) {
    console.error("Admin testimonial deletion failed", error);
    return NextResponse.json({ error: "Could not delete testimonial" }, { status: 503, headers: noStore });
  }
}
