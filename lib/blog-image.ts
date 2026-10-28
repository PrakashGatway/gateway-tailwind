import { constant } from "@/constant/index.constant";

const fallback = "/img/blog-banner-img.svg";

export function blogImageSource(image: unknown) {
  if (typeof image !== "string" || !image.trim()) return fallback;
  const value = image.trim();
  return /^https?:\/\//i.test(value)
    ? value
    : `${constant.REACT_APP_URL}/api/uploads/${value.replace(/^\/+/, "")}`;
}

export function cloudinaryCardImage(source: string, width: number) {
  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return null;
    const marker = "/image/upload/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex < 0) return null;

    const prefix = url.pathname.slice(0, markerIndex + marker.length);
    const segments = url.pathname.slice(markerIndex + marker.length).split("/");
    // Replace transformations already attached by the API, then request the
    // exact 16:10 crop used by the card.
    while (segments.length > 1 && /^(?:[a-z]{1,3}_[^/,]+)(?:,[a-z]{1,3}_[^/,]+)*$/i.test(segments[0])) {
      segments.shift();
    }
    if (!segments.length) return null;
    const height = Math.round(width * 10 / 16);
    url.pathname = `${prefix}c_fill,g_auto,w_${width},h_${height},q_auto,f_auto/${segments.join("/")}`;
    return url.toString();
  } catch {
    return null;
  }
}
