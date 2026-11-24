import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type StudentRecord = {
  _id: ObjectId | string;
  id?: string;
  image: string;
  imagePublicId?: string;
  name: string;
  content?: string;
  rank: number;
  courseName: string;
  univercity?: string;
  university?: string;
  type: string;
  __v?: number;
};

export type StudentInput = {
  image: string;
  name: string;
  content: string;
  rank: number;
  courseName: string;
  univercity: string;
  type: string;
};

export async function getStudentsCollection(): Promise<Collection<StudentRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<StudentRecord>("students");
}

export function parseStudentId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? value : null;
}

export function studentIdFilter(id: string) {
  return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { id }] };
}

function text(value: unknown, label: string, maxLength: number, required = false) {
  if (typeof value !== "string") throw new Error("Enter a valid " + label);
  const result = value.trim();
  if (required && !result) throw new Error("Enter a " + label);
  if (result.length > maxLength) throw new Error(label + " is too long");
  return result;
}

export function parseStudentInput(value: unknown): StudentInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Student details are required");
  }
  const raw = value as Record<string, unknown>;
  const rank = raw.rank;
  if (typeof rank !== "number" || !Number.isFinite(rank) || rank < 0 || rank > 100000) {
    throw new Error("Enter a valid rank");
  }
  return {
    image: text(raw.image ?? "", "image filename or URL", 2000),
    name: text(raw.name, "name", 160, true),
    content: text(raw.content ?? "", "content", 10000),
    rank,
    courseName: text(raw.courseName, "course name", 80, true),
    univercity: text(raw.univercity ?? raw.university ?? "", "university", 160),
    type: text(raw.type, "type", 60, true),
  };
}

export function serializeStudent(student: StudentRecord) {
  const id = String(student.id || student._id);
  return {
    _id: String(student._id),
    id,
    image: student.image || "",
    name: student.name || "",
    content: student.content || "",
    rank: typeof student.rank === "number" ? student.rank : Number(student.rank) || 0,
    courseName: student.courseName || "",
    univercity: student.univercity || student.university || "",
    type: student.type || "",
  };
}
