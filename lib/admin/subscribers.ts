import { ObjectId, type Collection, type Filter } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type SubscriberStatus = "subscribed" | "unsubscribed";
export type SubscriberRecord = {
  _id: ObjectId;
  email: string;
  status: SubscriberStatus;
  source: string;
  subscribedAt: Date;
  updatedAt: Date;
  ip?: string | null;
};

let indexesPromise: Promise<void> | undefined;

export async function getSubscribersCollection(): Promise<Collection<SubscriberRecord>> {
  const connection = await connectAdminDb();
  const collection = connection.connection.db!.collection<SubscriberRecord>("newsletter_subscribers");
  indexesPromise ??= Promise.all([
    collection.createIndex({ email: 1 }, { unique: true, name: "subscriber_email_unique" }),
    collection.createIndex({ status: 1, subscribedAt: -1 }, { name: "subscriber_status_date" }),
  ]).then(() => undefined).catch((error) => { indexesPromise = undefined; throw error; });
  await indexesPromise;
  return collection;
}

export function normalizeSubscriberEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address");
  }
  return email;
}

export function serializeSubscriber(record: SubscriberRecord) {
  return {
    id: String(record._id),
    email: record.email,
    status: record.status,
    source: record.source,
    subscribedAt: record.subscribedAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function subscriberFilter({ search, status, from, to }: { search: string; status: string; from: string; to: string }): Filter<SubscriberRecord> {
  const filter: Filter<SubscriberRecord> = {};
  if (status === "subscribed" || status === "unsubscribed") filter.status = status;
  if (search) filter.email = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  if (from || to) {
    filter.subscribedAt = {};
    if (from) filter.subscribedAt.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.subscribedAt.$lt = new Date(`${to}T00:00:00.000Z`);
  }
  return filter;
}
