"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "gateway_cookie_consent_v1";

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
    else setVisible(true);
  }, []);

  function acceptAll() {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    window.dispatchEvent(new Event("gateway-cookie-consent"));
    loadOptionalAnalytics();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-start px-4 py-6 " role="presentation">
      <section aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-description" role="dialog" aria-modal="true" className="w-full max-w-[820px] rounded-xl border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(35,20,50,0.2)] sm:p-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d71635]/10 text-[#d71635]">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="cookie-consent-title" className="text-lg font-semibold tracking-tight text-[#20212a] sm:text-xl">Accept the use of cookies</h2>
            <p id="cookie-consent-description" className="mt-2 text-sm leading-6 text-[#555761]">
              We use cookies and similar technologies to support this website, understand how it is used, and improve our services. Accepting allows optional analytics and advertising technologies to run on your device. Read our <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/cookie-policy">Cookie Policy</Link>, <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/privacy-policy">Privacy Policy</Link>, <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/terms">Terms and Conditions</Link>, and <Link className="font-medium text-[#9f1028] underline underline-offset-2 hover:text-[#d71635]" href="/content-policy">Content Policy</Link> for details.
            </p>
            <button type="button" onClick={acceptAll} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#b51e37] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8f172d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b51e37] focus-visible:ring-offset-2">
              Accept all cookies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
