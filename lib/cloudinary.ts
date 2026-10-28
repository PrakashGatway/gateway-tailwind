import { v2 as cloudinary } from "cloudinary";

function configuredCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured");
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

export async function uploadPopupBanner(file: File) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!allowed.has(file.type)) throw new Error("Use a JPG, PNG, WebP, or AVIF image");
  if (!file.size || file.size > 8 * 1024 * 1024) throw new Error("Image must be under 8 MB");
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  const result = await configuredCloudinary().uploader.upload(dataUri, {
    folder: "popupbanner",
    resource_type: "image",
    overwrite: false,
    unique_filename: true,
  });
  if (!result.secure_url || !result.public_id?.startsWith("popupbanner/")) {
    throw new Error("Cloudinary did not return a valid banner image");
  }
  return { imageUrl: result.secure_url, imagePublicId: result.public_id };
}

export async function destroyPopupBanner(publicId: string) {
  if (!publicId.startsWith("popupbanner/")) throw new Error("Invalid banner image ID");
  const result = await configuredCloudinary().uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Cloudinary could not delete the banner image");
  }
}
