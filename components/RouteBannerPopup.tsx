"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  fetchBannerPopups,
  findBannerForPath,
  getBannerImageUrl,
  type BannerAction,
  type BannerPopup,
} from "@/lib/banner-popups";
import { getWhatsAppMessage } from "@/lib/whatsapp-message";

const WHATSAPP_NUMBER = "918302092630";

function closeHint(action: BannerAction): string {
  switch (action.type) {
    case "contact": return "Close offer and open consultation form";
    case "route": return "Close offer and go to another page";
    case "whatsapp": return "Close offer and open WhatsApp";
    default: return "Close offer";
  }
}

export default function RouteBannerPopup() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [banners, setBanners] = useState<BannerPopup[]>([]);
  const [closedKey, setClosedKey] = useState<string | null>(null);
  const pendingAction = useRef<{ action: BannerAction; path: string } | null>(null);
  const currentPath = useRef(pathname);
  currentPath.current = pathname;

  useEffect(() => {
    let active = true;
    fetchBannerPopups().then((data) => {
      if (active) setBanners(data);
    }).catch(() => {
      if (active) setBanners([]);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setClosedKey(null);
    pendingAction.current = null;
  }, [pathname]);

  const banner = findBannerForPath(pathname, banners);
  const key = banner ? `${pathname}:${banner.id}` : null;
  const isOpen = Boolean(banner && key !== closedKey);
  const isFull = isOpen && banner?.layout === "full";
  const imageUrl = useMemo(
    () => banner ? getBannerImageUrl(banner) : null,
    [banner],
  );
  const imageAlt = banner
    ? banner.imageAlt || banner.title
    : "";

  useEffect(() => {
    if (!isFull) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isFull]);

  const performAction = (action: BannerAction) => {
    if (action.type === "contact") {
      if (pathname === "/thank-you" || pathname.startsWith("/onboarding")) {
        router.push("/contact");
      } else {
        window.dispatchEvent(new Event("openFooterModal"));
      }
    } else if (action.type === "route") {
      if (action.href.startsWith("/") && !action.href.startsWith("//")) {
        router.push(action.href);
      }
    } else if (action.type === "whatsapp") {
      const message = action.message || getWhatsAppMessage(pathname);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }
  };

  const dismiss = (action: BannerAction) => {
    if (!banner || !key || !isOpen) return;
    // New windows must open directly from the click or a browser may block them.
    if (action.type === "whatsapp") {
      performAction(action);
      pendingAction.current = null;
    } else {
      pendingAction.current = { action, path: pathname };
    }
    setClosedKey(key);
  };

  const onExitComplete = () => {
    const pending = pendingAction.current;
    pendingAction.current = null;
    if (pending && pending.path === currentPath.current) performAction(pending.action);
  };

  useEffect(() => {
    if (!isOpen || !banner) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss(banner.closeAction);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, banner, key]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 27 };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && banner && imageUrl && (
        banner.layout === "full" ? (
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#101424]/50 p-3  sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) dismiss(banner.closeAction);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={imageAlt}
              initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={transition}
              className="relative max-h-[80vh] max-w-full rounded-[24px] shadow-[0_35px_100px_rgba(0,0,0,0.4)]"
            >
              <button
                type="button"
                onClick={() => dismiss(banner.buttonAction)}
                aria-label={`Open offer: ${banner.title}`}
                className="block overflow-hidden rounded-[24px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <img
                  src={imageUrl}
                  srcSet={[640, 980, 1600].map((width) => `${getBannerImageUrl(banner, width)} ${width}w`).join(", ")}
                  sizes="(max-width: 1024px) 100vw, 980px"
                  alt={imageAlt}
                  className="block h-auto max-h-[80vh] w-auto max-w-[min(980px,calc(100vw-24px))] object-contain"
                />
              </button>
              <button
                type="button"
                onClick={() => dismiss(banner.closeAction)}
                title={closeHint(banner.closeAction)}
                aria-label={closeHint(banner.closeAction)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/95 text-[#a91534] shadow-lg transition hover:rotate-90 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d71635]"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.aside
            key={key}
            role="dialog"
            aria-label={imageAlt}
            initial={reduceMotion ? false : { opacity: 0, x: 36, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 26, scale: 0.96 }}
            transition={transition}
            className="fixed bottom-[14rem] right-3 z-[80] max-h-[150px] w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-2xl shadow-[0_22px_60px_rgba(27,20,37,0.3)] md:bottom-5 md:right-5"
          >
            <button
              type="button"
              onClick={() => dismiss(banner.buttonAction)}
              aria-label={`Open offer: ${banner.title}`}
              className="block w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#d71635]"
            >
              <img
                src={imageUrl}
                srcSet={[390, 780].map((width) => `${getBannerImageUrl(banner, width)} ${width}w`).join(", ")}
                sizes="(max-width: 414px) calc(100vw - 24px), 390px"
                alt={imageAlt}
                className="block h-auto max-h-[150px] w-full object-contain"
              />
            </button>
            <button
              type="button"
              onClick={() => dismiss(banner.closeAction)}
              title={closeHint(banner.closeAction)}
              aria-label={closeHint(banner.closeAction)}
              className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/60 bg-white/95 text-[#a91534] shadow-md transition hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d71635]"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.aside>
        )
      )}
    </AnimatePresence>
  );
}
