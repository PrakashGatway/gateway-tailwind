import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";
import { lookup } from "geoip-lite";
import {
  activityCutoff,
  ANALYTICS_RETENTION_MS,
  getActivityCollection,
  type ActivityEvent,
  type ActivityType,
} from "@/lib/analytics";

export const runtime = "nodejs";

const uuidPattern =
  /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const types = new Set<ActivityType>([
  "page_view",
  "page_duration",
  "click",
  "form_start",
  "form_submit",
]);
const noStore = { "Cache-Control": "no-store" };
const rateWindowMs = 60_000;
const maxEventsPerWindow = 600;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const leadKeys = new Set([
  "name",
  "fullname",
  "firstname",
  "lastname",
  "email",
  "emailid",
  "phone",
  "mobile",
  "mobileno",
  "phonenumber",
  "city",
  "state",
  "country",
  "destinationcountry",
  "countrytostudy",
  "programlevel",
  "course",
  "coursesubject",
  "intake",
  "intakeyear",
  "testtype",
]);

function cleanLead(value: unknown): ActivityEvent["lead"] {
  if (!value || typeof value !== "object") return undefined;
  const lead = value as Record<string, unknown>;
  const rawFields = Array.isArray(lead.fields) ? lead.fields.slice(0, 16) : [];
  const fields = rawFields.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const field = item as Record<string, unknown>;
    const key = cleanText(field.key, 32).toLowerCase();
    const text = cleanText(field.value, 120);
    return leadKeys.has(key) && text ? [{ key, value: text }] : [];
  });
  const get = (...keys: string[]) =>
    fields.find((field) => keys.includes(field.key))?.value;
  const name =
    get("name", "fullname") ||
    [get("firstname"), get("lastname")].filter(Boolean).join(" ");
  return {
    name: name || undefined,
    email: get("email", "emailid"),
    phone: get("phone", "mobile", "mobileno", "phonenumber"),
    fields,
  };
}

function allowEvents(key: string, count: number) {
  const now = Date.now();
  const old = rateBuckets.get(key);
  const bucket =
    old && old.resetAt > now ? old : { count: 0, resetAt: now + rateWindowMs };
  bucket.count += count;
  rateBuckets.set(key, bucket);
  if (rateBuckets.size > 5000) {
    for (const [id, value] of rateBuckets)
      if (value.resetAt <= now) rateBuckets.delete(id);
  }
  return bucket.count <= maxEventsPerWindow;
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string"
    ? value
        .replace(/[\x00-\x1f\x7f]/g, " ")
        .trim()
        .slice(0, max)
    : "";
}

function getIp(request: NextRequest) {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0],
  ];
  return (
    candidates
      .map((value) => value?.trim())
      .find((value) => value && isIP(value)) || null
  );
}

function getCountry(request: NextRequest, geoCountry: string | null) {
  const value =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country");
  if (value && /^[A-Z]{2}$/i.test(value) && value.toUpperCase() !== "XX")
    return value.toUpperCase();
  return geoCountry;
}

function getDevice(request: NextRequest): ActivityEvent["device"] {
  const agent = request.headers.get("user-agent") || "";
  if (/ipad|tablet|playbook/i.test(agent)) return "tablet";
  if (/mobile|android|iphone/i.test(agent)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  // if (request.headers.get("sec-fetch-site") === "cross-site") {
  //   return NextResponse.json(
  //     { error: "Invalid origin" },
  //     { status: 403, headers: noStore },
  //   );
  // }
  // const origin = request.headers.get("origin");
  // if (origin && origin !== request.nextUrl.origin) {
  //   return NextResponse.json(
  //     { error: "Invalid origin" },
  //     { status: 403, headers: noStore },
  //   );
  // }
  if (Number(request.headers.get("content-length") || 0) > 12000) {
    return NextResponse.json(
      { error: "Payload too large" },
      { status: 413, headers: noStore },
    );
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return NextResponse.json(
      { error: "JSON required" },
      { status: 415, headers: noStore },
    );
  }

  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 12000) throw new Error("Payload too large");
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: noStore },
    );
  }

  if (!input || typeof input !== "object")
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: noStore },
    );
  const payload = input as Record<string, unknown>;
  if (
    !uuidPattern.test(String(payload.visitorId)) ||
    !uuidPattern.test(String(payload.sessionId)) ||
    !Array.isArray(payload.events) ||
    payload.events.length < 1 ||
    payload.events.length > 20
  ) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400, headers: noStore },
    );
  }

  const now = new Date();
  const ip = getIp(request);
  if (!allowEvents(ip || String(payload.visitorId), payload.events.length)) {
    return NextResponse.json(
      { error: "Too many events" },
      { status: 429, headers: noStore },
    );
  }
  const geo = ip ? lookup(ip) : null;
  const country = getCountry(request, geo?.country || null);
  const city = geo?.city?.trim().slice(0, 80) || null;
  const device = getDevice(request);
  const events: ActivityEvent[] = [];
  for (const rawEvent of payload.events) {
    if (!rawEvent || typeof rawEvent !== "object") continue;
    const event = rawEvent as Record<string, unknown>;
    const type = event.type;
    const path = cleanText(event.path, 240);
    if (
      !types.has(type as ActivityType) ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      path.startsWith("/admin") ||
      path.includes("?") ||
      path.includes("#")
    )
      continue;
    const durationMs = type === "page_duration" ? event.durationMs : undefined;
    if (
      type === "page_duration" &&
      (typeof durationMs !== "number" || !Number.isInteger(durationMs) || durationMs < 1000 || durationMs > 86400000)
    )
      continue;
    const clientTime =
      typeof event.at === "number" && Number.isFinite(event.at)
        ? event.at
        : now.getTime();
    const occurredAt = new Date(
      Math.min(
        now.getTime(),
        Math.max(now.getTime() - 5 * 60 * 1000, clientTime),
      ),
    );
    if (occurredAt < activityCutoff()) continue;
    events.push({
      visitorId: String(payload.visitorId),
      sessionId: String(payload.sessionId),
      type: type as ActivityType,
      path,
      label: cleanText(event.label, 100),
      occurredAt,
      expiresAt: new Date(occurredAt.getTime() + ANALYTICS_RETENTION_MS),
      ip,
      country,
      city,
      device,
      ...(type === "page_duration" ? { durationMs: durationMs as number } : {}),
      ...(type === "form_submit" ? { lead: cleanLead(event.lead) } : {}),
    });
  }

  if (!events.length)
    return NextResponse.json(
      { error: "No valid events" },
      { status: 400, headers: noStore },
    );
  try {
    const collection = await getActivityCollection();
    await collection.insertMany(events, { ordered: false });
    return NextResponse.json(
      { accepted: events.length },
      { status: 202, headers: noStore },
    );
  } catch (error) {
    console.error("Analytics write failed", error);
    return NextResponse.json(
      { error: "Analytics unavailable" },
      { status: 503, headers: noStore },
    );
  }
}
