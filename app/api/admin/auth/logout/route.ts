import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin/session";

export async function POST(request: NextRequest) {
  // if (request.headers.get("sec-fetch-site") === "cross-site") {
  //   return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  // }

  const response = NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
