import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type TestimonialRecord = {
  _id: string | ObjectId;
  id?: string;
  name: string;
  content: string;
  status: boolean;
  type: string;
  univercity?: string;
  university?: string;
  __v?: number;
};

export type TestimonialInput = {
  name: string;
  content: string;
  status: boolean;
  type: string;
  univercity: string;
};

export async function getTestimonialsCollection(): Promise<Collection<TestimonialRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<TestimonialRecord>("testimonials");
}

export function parseTestimonialId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? value : null;
}

export function testimonialIdFilter(id: string) {
  return {
    $or: [
      { _id: id },
      { _id: new ObjectId(id) },
      { id },
    ],
  };
}

function text(value: unknown, label: string, maxLength: number, required = false) {
  if (typeof value !== "string") throw new Error("Enter a valid " + label);
  const result = value.trim();
  if (required && !result) throw new Error("Enter a " + label);
  if (result.length > maxLength) throw new Error(label + " is too long");
  return result;
}

export function parseTestimonialInput(value: unknown): TestimonialInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Testimonial details are required");
  }
  const raw = value as Record<string, unknown>;
  if (typeof raw.status !== "boolean") throw new Error("Choose whether this testimonial is active");
  return {
    name: text(raw.name, "name", 120, true),
    content: text(raw.content, "content", 10000, true),
    status: raw.status,
    type: text(raw.type, "type", 60, true),
    univercity: text(raw.univercity ?? raw.university, "university", 120, true),
  };
}

export function serializeTestimonial(record: TestimonialRecord) {
  const id = String(record.id || record._id);
  return {
    _id: String(record._id),
    id,
    name: record.name || "",
    content: record.content || "",
    status: record.status === true,
    type: record.type || "",
    univercity: record.univercity || record.university || "",
  };
}
