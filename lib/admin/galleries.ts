import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type GalleryRecord = {
  _id: ObjectId | string;
  id?: string;
  title: string;
  mediaLink: string;
  catogary: string;
  Status: boolean;
  __v?: number;
};

export type GalleryInput = Pick<GalleryRecord, "title" | "mediaLink" | "catogary" | "Status">;

export async function getGalleriesCollection(): Promise<Collection<GalleryRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<GalleryRecord>("galleries");
}

export function parseGalleryId(value: string) {
  return /^[a-f\d]{24}$/i.test(value) ? value : null;
}

export function galleryIdFilter(id: string) {
  return { $or: [{ _id: new ObjectId(id) }, { _id: id }, { id }] };
}

function text(value: unknown, label: string, maxLength: number, required = false) {
  if (typeof value !== "string") throw new Error("Enter a valid " + label);
  const result = value.trim();
  if (required && !result) throw new Error("Enter a " + label);
  if (result.length > maxLength) throw new Error(label + " is too long");
  return result;
}

export function parseGalleryInput(value: unknown): GalleryInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Gallery details are required");
  const raw = value as Record<string, unknown>;
  const catogary = text(raw.catogary, "category", 20, true).toLowerCase();
  if (catogary !== "image" && catogary !== "video") throw new Error("Choose image or video category");
  if (typeof raw.Status !== "boolean") throw new Error("Choose whether this item is active");
  return {
    title: text(raw.title, "title", 180, true),
    mediaLink: text(raw.mediaLink, "media link", 2000, true),
    catogary,
    Status: raw.Status,
  };
}

export function serializeGallery(item: GalleryRecord) {
  const id = String(item.id || item._id);
  return { _id: String(item._id), id, title: item.title || "", mediaLink: item.mediaLink || "", catogary: item.catogary || "image", Status: item.Status !== false };
}
