"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { getWhatsAppMessage, getWhatsAppTeaser } from "@/lib/whatsapp-message";

const WHATSAPP_NUMBER = "918302092630";
const PILL_SPRING = { type: "spring" as const, stiffness: 320, damping: 30, mass: 0.8 };

export default function ContactDock() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [showGreeting, setShowGreeting] = useState(true);
  const [contactActive, setContactActive] = useState(false);
  const [whatsappActive, setWhatsappActive] = useState(false);
  const message = getWhatsAppMessage(pathname);
  const teaser = getWhatsAppTeaser(pathname);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const whatsappExpanded = showGreeting || whatsappActive;
  const pillTransition = reduceMotion
    ? { duration: 0 }
    : { width: PILL_SPRING, boxShadow: { duration: 0.25 } };

  useEffect(() => {
    setShowGreeting(true);
    const timer = window.setTimeout(() => setShowGreeting(false), 4500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleGetInTouch = () => {
    // These pages do not mount the footer contact form.
    if (pathname === "/thank-you" || pathname.startsWith("/onboarding")) {
      router.push("/contact");
      return;
    }

    window.dispatchEvent(new Event("openFooterModal"));
  };

  return (
    <div className="fixed bottom-24 right-0 z-[60] flex flex-col items-end gap-2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:gap-3" aria-label="Contact options">
      <AnimatePresence mode="wait">
        {showGreeting && (
          <motion.div
            key={pathname}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: 20, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 25 }}
            className="pointer-events-none absolute -top-20 right-3 w-52 rounded-2xl border border-green-100 bg-white px-4 py-3 text-slate-800 shadow-[0_14px_35px_rgba(15,23,42,0.18)] md:right-4 md:w-56"
          >
            <p className="text-sm font-bold text-[#128C7E]">Hi! Connect with us 👋</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{teaser}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleGetInTouch}
        onMouseEnter={() => setContactActive(true)}
        onMouseLeave={() => setContactActive(false)}
        onFocus={() => setContactActive(true)}
        onBlur={() => setContactActive(false)}
        aria-label="Get in touch with Gateway Abroad"
        initial={{ width: 56 }}
        animate={{
          width: contactActive ? 208 : 56,
          boxShadow: contactActive
            ? "0 12px 32px rgba(183,15,45,0.45)"
            : "0 8px 24px rgba(183,15,45,0.30)",
        }}
        transition={pillTransition}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="flex h-14 items-center overflow-hidden rounded-l-full bg-gradient-to-r from-[#b70f2d] to-[#df2c4c] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
      >
        <motion.span
          aria-hidden="true"
          animate={{ scale: contactActive ? 1.1 : 1, rotate: contactActive ? -6 : 0 }}
          transition={reduceMotion ? { duration: 0 } : PILL_SPRING}
          className="flex h-14 w-14 shrink-0 items-center justify-center"
        >
          <Mail className="h-6 w-6" strokeWidth={2.2} />
        </motion.span>
        <motion.span
          aria-hidden={!contactActive}
          initial={false}
          animate={{ opacity: contactActive ? 1 : 0, x: contactActive ? 0 : 12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.22, delay: contactActive ? 0.08 : 0 }}
          className="whitespace-nowrap pr-5 text-sm font-semibold"
        >
          Get in touch
        </motion.span>
      </motion.button>

      <motion.a
        href={whatsappHref}
        data-track-label="WhatsApp floating contact"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setWhatsappActive(true)}
        onMouseLeave={() => setWhatsappActive(false)}
        onFocus={() => setWhatsappActive(true)}
        onBlur={() => setWhatsappActive(false)}
        aria-label={`Chat on WhatsApp: ${message}`}
        title="Chat on WhatsApp"
        initial={{ width: 56 }}
        animate={{
          width: whatsappExpanded ? 224 : 56,
          boxShadow: whatsappExpanded
            ? "0 12px 32px rgba(18,140,126,0.5)"
            : "0 8px 24px rgba(18,140,126,0.35)",
        }}
        transition={pillTransition}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className="flex h-14 items-center overflow-hidden rounded-l-full bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
      >
        <motion.span
          aria-hidden="true"
          animate={{ scale: whatsappExpanded ? 1.08 : 1, rotate: whatsappExpanded ? -5 : 0 }}
          transition={reduceMotion ? { duration: 0 } : PILL_SPRING}
          className="flex h-14 w-14 shrink-0 items-center justify-center"
        >
          <FaWhatsapp className="h-8 w-8" />
        </motion.span>
        <motion.span
          aria-hidden={!whatsappExpanded}
          initial={false}
          animate={{ opacity: whatsappExpanded ? 1 : 0, x: whatsappExpanded ? 0 : 12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.24, delay: whatsappExpanded ? 0.1 : 0 }}
          className="whitespace-nowrap pr-5 text-sm font-semibold"
        >
          Chat on WhatsApp
        </motion.span>
      </motion.a>
    </div>
  );
}
