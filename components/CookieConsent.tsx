"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "gateway_cookie_consent_v1";
const DISMISS_KEY = "gateway_cookie_notice_dismissed_v1";

function loadOptionalAnalytics() {
  // if (document.querySelector('[data-gateway-analytics="true"]')) return;
  // const gtm = document.createElement("script");
  // gtm.async = true;
  // gtm.dataset.gatewayAnalytics = "true";
  // gtm.src = "https://www.googletagmanager.com/gtm.js?id=GTM-KBCB5JV7";
  // (window as any).dataLayer = (window as any).dataLayer || [];
  // (window as any).dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  // document.head.appendChild(gtm);

  // const gtagLibrary = document.createElement("script");
  // gtagLibrary.async = true;
  // gtagLibrary.dataset.gatewayAnalytics = "true";
  // gtagLibrary.src = "https://www.googletagmanager.com/gtag/js?id=G-6SL4VEMM29";
  // document.head.appendChild(gtagLibrary);
  // (window as any).gtag = function gtag() { (window as any).dataLayer.push(arguments); };
  // (window as any).gtag("js", new Date());
  // (window as any).gtag("config", "G-6SL4VEMM29");
  // (window as any).gtag("config", "AW-11490727253");

  // const clarity = document.createElement("script");
  // clarity.async = true;
  // clarity.dataset.gatewayAnalytics = "true";
  // clarity.src = "https://www.clarity.ms/tag/86ec71cd93d340a4b8f44371395504b5";
  // document.head.appendChild(clarity);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(CONSENT_KEY) === "accepted";
    if (accepted) loadOptionalAnalytics();
    else setVisible(window.sessionStorage.getItem(DISMISS_KEY) !== "dismissed");
  }, []);

  function acceptAll() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("gateway-cookie-consent"));
    loadOptionalAnalytics();
    setVisible(false);
  }

  function cancel() {
    window.sessionStorage.setItem(DISMISS_KEY, "dismissed");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-start px-4 py-6 " role="presentation">
      <section aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" role="dialog" aria-modal="true" className="relative w-full max-w-[620px] rounded-xl border border-white/80 bg-white p-4 pr-12 shadow-[0_24px_80px_rgba(35,20,50,0.2)] sm:p-5 sm:pr-14">
        <button type="button" onClick={cancel} aria-label="Cancel cookie notice" title="Cancel" className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#68656d] transition hover:bg-[#f4f1f2] hover:text-[#27242c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f172d]">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d71635]/10 text-[#d71635]">
            <Cookie className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="cookie-consent-title" className="text-base font-semibold tracking-tight text-[#20212a] sm:text-lg">Accept the use of cookies</h2>
            <p id="cookie-consent-description" className="mt-1.5 text-sm leading-5 text-[#555761]">
              Cookies help our site work and improve your experience. Accepting enables optional analytics. Read our <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/cookie-policy">Cookie Policy</Link> and <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/privacy-policy">Privacy Policy</Link>.
            </p>
            <button type="button" onClick={acceptAll} className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-[#b51e37] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f172d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b51e37] focus-visible:ring-offset-2">
              Accept all cookies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
