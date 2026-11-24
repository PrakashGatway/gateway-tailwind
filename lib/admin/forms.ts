import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type FormRecord = { _id: ObjectId; [key: string]: unknown };

export async function getFormsCollection(): Promise<Collection<FormRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<FormRecord>("forms");
}

export function parseFormId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? new ObjectId(value) : null;
}

function safeValue(value: unknown, depth = 0): unknown {
  if (value === null || typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") {
    return value.length > 4000 ? value.slice(0, 4000) + "… [truncated]" : value;
  }
  if (value instanceof Date) return value.toISOString();
  if (value instanceof ObjectId) return value.toHexString();
  if (!value || typeof value !== "object") return String(value);

  const bsonType = (value as { _bsontype?: string })._bsontype;
  if (bsonType === "Binary" || Buffer.isBuffer(value)) return { _fileBinary: true };
  if (depth >= 3) return "[Nested data omitted]";
  if (Array.isArray(value)) {
    const result = value.slice(0, 20).map((item) => safeValue(item, depth + 1));
    if (value.length > 20) result.push("[More items omitted]");
    return result;
  }

  const entries = Object.entries(value as Record<string, unknown>).slice(0, 30);
  const result = Object.fromEntries(entries.map(([key, item]) => [key, safeValue(item, depth + 1)]));
  if (Object.keys(value).length > entries.length) result._more = "Additional fields omitted";
  return result;
}

export function serializeForm(record: FormRecord) {
  const createdAt = record.createdAt instanceof Date
    ? record.createdAt.toISOString()
    : typeof record.createdAt === "string" && !Number.isNaN(Date.parse(record.createdAt))
      ? new Date(record.createdAt).toISOString()
      : record._id.getTimestamp().toISOString();

  return {
    id: String(record._id),
    createdAt,
    fields: Object.entries(record)
      .filter(([key]) => key !== "_id" && key !== "__v" && key !== "createdAt")
      .map(([key, value]) => ({ key, value: safeValue(value) })),
  };
}
