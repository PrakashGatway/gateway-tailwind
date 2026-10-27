import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    return NextResponse.json(
      admin ? { admin } : { error: "Unauthorized." },
      { status: admin ? 200 : 401, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Session check is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
