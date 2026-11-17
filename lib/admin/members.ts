import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type MemberRecord = {
  _id: ObjectId | string;
  image: string;
  name: string;
  content: string;
  __v?: number;
};

export type MemberInput = Pick<MemberRecord, "image" | "name" | "content">;

export async function getMembersCollection(): Promise<Collection<MemberRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<MemberRecord>("members");
}

export function parseMemberId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? value : null;
}

export function memberIdFilter(id: string) {
  return { $or: [{ _id: new ObjectId(id) }, { _id: id }] };
}

export function parseMemberInput(value: unknown): MemberInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Member details are required");
  }
  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const content = typeof raw.content === "string" ? raw.content.trim() : "";
  const image = typeof raw.image === "string" ? raw.image.trim() : "";

  if (!name) throw new Error("Enter a member name");
  if (name.length > 160) throw new Error("Name must be under 160 characters");
  if (!content) throw new Error("Enter the member description");
  if (content.length > 10000) throw new Error("Description must be under 10,000 characters");
  if (!image) throw new Error("Enter an image filename or image URL");
  if (image.length > 2000) throw new Error("Image path is too long");
  if (image.startsWith("//") || /^(?!https?:)[a-z][a-z\d+.-]*:/i.test(image)) {
    throw new Error("Use an HTTP(S) image URL or an uploaded image filename");
  }

  return { name, content, image };
}

export function serializeMember(member: MemberRecord) {
  return {
    id: String(member._id),
    image: member.image || "",
    name: member.name || "",
    content: member.content || "",
  };
}
