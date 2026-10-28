export type BannerAction =
  | { type: "contact" }
  | { type: "route"; href: string }
  | { type: "whatsapp"; message?: string }
  | { type: "none" };

export type BannerTarget = { path: string; match: "exact" | "prefix" };

export type BannerPopup = {
  id: string;
  title: string;
  imageAlt: string;
  imageUrl: string;
  enabled: boolean;
  layout: "full" | "sidebar";
  targets: BannerTarget[];
  buttonAction: BannerAction;
  closeAction: BannerAction;
  priority: number;
};

export async function fetchBannerPopups(): Promise<BannerPopup[]> {
  const response = await fetch("/api/banner-popups", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load banner popups");
  const data = await response.json();
  return Array.isArray(data.banners) ? data.banners : [];
}

function targetMatches(pathname: string, target: BannerTarget) {
  const path = target.path.toLowerCase();
  return target.match === "exact"
    ? pathname === path
    : path.endsWith("/") || path.endsWith("-")
      ? pathname.startsWith(path)
      : pathname === path || pathname.startsWith(`${path}/`);
}

export function findBannerForPath(pathname: string, banners: BannerPopup[]): BannerPopup | null {
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return banners
    .filter((banner) => banner.enabled && banner.targets.some((target) => targetMatches(path, target)))
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      const specificity = (banner: BannerPopup) => Math.max(...banner.targets.filter((target) => targetMatches(path, target)).map((target) => target.path.length + (target.match === "exact" ? 1000 : 0)));
      return specificity(b) - specificity(a);
    })[0] || null;
}

export function getBannerImageUrl(banner: BannerPopup, width?: number): string {
  try {
    const url = new URL(banner.imageUrl);
    if (url.hostname !== "res.cloudinary.com" || !url.pathname.includes("/image/upload/")) return banner.imageUrl;
    const desiredWidth = width || (banner.layout === "full" ? 1600 : 780);
    const desiredHeight = banner.layout === "full" ? Math.round(desiredWidth * 0.8) : Math.round(desiredWidth * 150 / 390);
    url.pathname = url.pathname.replace("/image/upload/", `/image/upload/c_limit,w_${desiredWidth},h_${desiredHeight},q_auto,f_auto/`);
    return url.toString();
  } catch {
    return banner.imageUrl;
  }
}
