import { createHash, timingSafeEqual } from "node:crypto";
import { compare, hash } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import Admin from "@/models/Admin";
import { connectAdminDb } from "@/lib/admin/db";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE,
  createAdminToken,
} from "@/lib/admin/session";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;
const DUMMY_HASH = "$2b$12$oeGiT6cWDK2gofiTdP8x0OMNnMalIklr7oXCaDH5FZitehhQXlVx2";
const attempts = new Map<string, { failures: number; resetsAt: number }>();

function failureCount(email: string) {
  const entry = attempts.get(email);
  if (!entry || entry.resetsAt <= Date.now()) {
    attempts.delete(email);
    return 0;
  }
  return entry.failures;
}

function recordFailure(email: string) {
  const now = Date.now();
  const entry = attempts.get(email);
  attempts.set(email, {
    failures: entry && entry.resetsAt > now ? entry.failures + 1 : 1,
    resetsAt: entry && entry.resetsAt > now ? entry.resetsAt : now + WINDOW_MS,
  });
  if (attempts.size > 1000) {
    for (const [key, value] of attempts) {
      if (value.resetsAt <= now) attempts.delete(key);
    }
  }
}

function sameOrigin(request: NextRequest) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function invalidCredentials() {
  return NextResponse.json(
    { error: "Invalid email or password." },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 4096) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const fields = input as Record<string, unknown>;
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";
  const password = typeof fields.password === "string" ? fields.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !password || password.length > 256) {
    return invalidCredentials();
  }
  if (failureCount(email) >= MAX_FAILURES) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in 15 minutes." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await connectAdminDb();
    const admin = await Admin.findOne({ email }).select("+password name email isActive");
    const storedPassword = admin?.password || "";
    let valid = false;
    const isBcrypt = /^\$2[aby]\$\d{2}\$/.test(storedPassword);

    if (admin && admin.isActive !== false && isBcrypt) {
      valid = await compare(password, storedPassword);
    } else {
      // Keep the invalid-user path expensive and support the existing legacy record.
      await compare(password, DUMMY_HASH);
      if (admin && admin.isActive !== false && storedPassword) {
        const submitted = createHash("sha256").update(password).digest();
        const legacy = createHash("sha256").update(storedPassword).digest();
        valid = timingSafeEqual(submitted, legacy);
      }
    }

    if (!valid || !admin) {
      recordFailure(email);
      return invalidCredentials();
    }

    if (!isBcrypt) {
      const secureHash = await hash(password, 12);
      await Admin.updateOne(
        { _id: admin._id, password: storedPassword },
        { $set: { password: secureHash } },
      );
    }

    attempts.delete(email);
    const token = await createAdminToken(String(admin._id));
    const response = NextResponse.json(
      { admin: { name: admin.name, email: admin.email } },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: "Sign-in is temporarily unavailable. Please try again." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
