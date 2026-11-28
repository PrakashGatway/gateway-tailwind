import { ObjectId, type Collection, type Filter } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";

export type BlogRating = { _id: ObjectId; slug: string; title: string; rating: number; createdAt: Date; ip?: string | null };
let indexesPromise: Promise<void> | undefined;
export async function getRatingsCollection(): Promise<Collection<BlogRating>> {
  const connection = await connectAdminDb();
  const collection = connection.connection.db!.collection<BlogRating>("blog_ratings");
  indexesPromise ??= Promise.all([
    collection.createIndex({ slug: 1, createdAt: -1 }, { name: "ratings_by_blog" }),
    collection.createIndex({ createdAt: -1 }, { name: "ratings_recent" }),
  ]).then(() => undefined).catch((error) => { indexesPromise = undefined; throw error; });
  await indexesPromise;
  return collection;
}
export function cleanRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");
  return rating;
}
export function cleanSlug(value: unknown) {
  const slug = typeof value === "string" ? value.trim().slice(0, 180) : "";
  if (!slug || !/^[a-zA-Z0-9/_-]+$/.test(slug)) throw new Error("Invalid blog");
  return slug;
}
export function serializeRating(record: BlogRating) { return { id: String(record._id), slug: record.slug, title: record.title, rating: record.rating, createdAt: record.createdAt.toISOString() }; }
export function ratingSearch(value: string): Filter<BlogRating> { return value ? { $or: [{ slug: { $regex: value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { title: { $regex: value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }] } : {}; }
