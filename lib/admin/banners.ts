import { ObjectId, type Collection } from "mongodb";
import { connectAdminDb } from "@/lib/admin/db";
import { destroyPopupBanner } from "@/lib/cloudinary";
import type { BannerAction, BannerPopup, BannerTarget } from "@/lib/banner-popups";

export type BannerRecord = Omit<BannerPopup, "id"> & {
  _id: ObjectId;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerInput = Omit<BannerPopup, "id" | "imageUrl">;
type CleanupRecord = { _id: ObjectId; bannerId: ObjectId; publicId: string; createdAt: Date };

let indexesPromise: Promise<void> | undefined;

export async function getBannerCollection(): Promise<Collection<BannerRecord>> {
  const connection = await connectAdminDb();
  const collection = connection.connection.db!.collection<BannerRecord>("banner_popups");
  indexesPromise ??= collection.createIndex({ enabled: -1, priority: -1, updatedAt: -1 }, { name: "active_banner_order" })
    .then(() => undefined).catch((error) => { indexesPromise = undefined; throw error; });
  await indexesPromise;
  return collection;
}

async function cleanupCollection(): Promise<Collection<CleanupRecord>> {
  const connection = await connectAdminDb();
  return connection.connection.db!.collection<CleanupRecord>("banner_asset_deletions");
}

export async function queueImageDeletion(publicId: string, bannerId: ObjectId) {
  const collection = await cleanupCollection();
  const result = await collection.insertOne({ _id: new ObjectId(), bannerId, publicId, createdAt: new Date() });
  return result.insertedId;
}

export async function cancelImageDeletion(id: ObjectId) {
  await (await cleanupCollection()).deleteOne({ _id: id });
}

export async function processImageDeletion(id: ObjectId, publicId: string) {
  await destroyPopupBanner(publicId);
  await (await cleanupCollection()).deleteOne({ _id: id });
}

export async function retryPendingImageDeletions() {
  const collection = await cleanupCollection();
  const pending = await collection.find({}).sort({ createdAt: 1 }).limit(10).toArray();
  const banners = await getBannerCollection();
  for (const task of pending) {
    try {
      const banner = await banners.findOne({ _id: task.bannerId }, { projection: { imagePublicId: 1 } });
      if (banner?.imagePublicId === task.publicId) continue;
      await processImageDeletion(task._id, task.publicId);
    }
    catch (error) { console.error("Banner image cleanup will retry", error); }
  }
}

function validRoute(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") &&
    !value.includes("?") && !value.includes("#") && !/[\r\n]/.test(value) && value.length <= 180;
}

function parseAction(value: unknown): BannerAction {
  if (!value || typeof value !== "object") throw new Error("Choose a valid popup action");
  const raw = value as Record<string, unknown>;
  if (raw.type === "contact" || raw.type === "none") return { type: raw.type };
  if (raw.type === "route" && validRoute(raw.href)) return { type: "route", href: raw.href };
  if (raw.type === "whatsapp" && (raw.message === undefined || (typeof raw.message === "string" && raw.message.length <= 500))) {
    return { type: "whatsapp", ...(raw.message ? { message: raw.message } : {}) };
  }
  throw new Error("Check the popup action details");
}

export function parseBannerInput(value: unknown): BannerInput {
  if (!value || typeof value !== "object") throw new Error("Banner details are required");
  const raw = value as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const imageAlt = typeof raw.imageAlt === "string" ? raw.imageAlt.trim() : "";
  if (!title || title.length > 100) throw new Error("Enter a title under 100 characters");
  if (imageAlt.length > 180) throw new Error("Image description must be under 180 characters");
  if (raw.layout !== "full" && raw.layout !== "sidebar") throw new Error("Choose a popup size");
  if (!Array.isArray(raw.targets) || raw.targets.length < 1 || raw.targets.length > 15) throw new Error("Add 1 to 15 route targets");
  const targets: BannerTarget[] = raw.targets.map((value) => {
    if (!value || typeof value !== "object") throw new Error("Invalid route target");
    const target = value as Record<string, unknown>;
    if (!validRoute(target.path) || (target.match !== "exact" && target.match !== "prefix")) throw new Error("Each target needs a valid route and match type");
    return { path: target.path.replace(/\/+$/, "") || "/", match: target.match };
  });
  if (new Set(targets.map((target) => `${target.match}:${target.path.toLowerCase()}`)).size !== targets.length) {
    throw new Error("Remove duplicate route targets");
  }
  const priority = Number(raw.priority ?? 0);
  if (!Number.isInteger(priority) || priority < -100 || priority > 100) throw new Error("Priority must be between -100 and 100");
  return {
    title,
    imageAlt: imageAlt || title,
    layout: raw.layout,
    targets,
    buttonAction: parseAction(raw.buttonAction),
    closeAction: parseAction(raw.closeAction),
    enabled: raw.enabled === true,
    priority,
  };
}

export function serializeBanner(record: BannerRecord) {
  return {
    id: String(record._id),
    title: record.title,
    imageAlt: record.imageAlt,
    imageUrl: record.imageUrl,
    enabled: record.enabled,
    layout: record.layout,
    targets: record.targets,
    buttonAction: record.buttonAction,
    closeAction: record.closeAction,
    priority: record.priority,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
