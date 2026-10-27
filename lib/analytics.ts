import { connectAdminDb } from "@/lib/admin/db";
import type { Collection } from "mongodb";

export const ANALYTICS_RETENTION_DAYS = 15;
export const ANALYTICS_RETENTION_MS = ANALYTICS_RETENTION_DAYS * 24 * 60 * 60 * 1000;

export type ActivityType = "page_view" | "click" | "form_start" | "form_submit";
export type LeadField = { key: string; value: string };
export type LeadSnapshot = { name?: string; email?: string; phone?: string; fields: LeadField[] };

export type ActivityEvent = {
  visitorId: string;
  sessionId: string;
  type: ActivityType;
  path: string;
  label: string;
  occurredAt: Date;
  expiresAt: Date;
  ip: string | null;
  country: string | null;
  device: "mobile" | "tablet" | "desktop";
  lead?: LeadSnapshot;
};

let indexesPromise: Promise<void> | undefined;

export async function getActivityCollection(): Promise<Collection<ActivityEvent>> {
  const connection = await connectAdminDb();
  const collection = connection.connection.db!.collection<ActivityEvent>("visitor_events");
  indexesPromise ??= Promise.all([
    collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: "activity_ttl_15_days" }),
    collection.createIndex({ visitorId: 1, occurredAt: -1 }, { name: "visitor_timeline" }),
    collection.createIndex({ occurredAt: -1 }, { name: "recent_activity" }),
    collection.createIndex({ type: 1, occurredAt: -1 }, { name: "activity_type" }),
  ]).then(() => undefined).catch((error) => {
    indexesPromise = undefined;
    throw error;
  });
  await indexesPromise;
  return collection;
}

export function activityCutoff() {
  return new Date(Date.now() - ANALYTICS_RETENTION_MS);
}
