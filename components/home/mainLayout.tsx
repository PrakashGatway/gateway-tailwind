"use client";

import { ReactNode, Suspense, lazy, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalProvider, useGlobal } from "@/hooks/AppStateContext";
import { usePathname } from "next/navigation";
import Loader from "../loader";
import Header from "../header";
import { Footer } from "../footer";
import ContactDock from "../ContactDock";
import RouteBannerPopup from "../RouteBannerPopup";
import { BannerCategoryProvider } from "../BannerCategoryContext";
import VisitorTracker from "@/components/analytics/VisitorTracker";
import CookieConsent from "@/components/CookieConsent";


// const Header = lazy(() => import("@/components/header"));
// const Footer = lazy(() => import("@/components/footer"));
// Login is temporarily disabled. Restore this import with the drawer below.
// const AuthDrawer = lazy(() => import("../auth/drawer"));

const hideLayoutOnPaths = ['/thank-you'];
const COOKIE_CONSENT_KEY = "gateway_cookie_consent_v1";

function ConsentAwareVisitorTracker() {
  const [consented, setConsented] = useState(false);
  useEffect(() => {
    const syncConsent = () => setConsented(window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
    syncConsent();
    window.addEventListener("gateway-cookie-consent", syncConsent);
    window.addEventListener("storage", syncConsent);
    return () => {
      window.removeEventListener("gateway-cookie-consent", syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);
  return consented ? <VisitorTracker /> : null;
}

const LayoutFallback = () => (
  null
);

function LoaderWrapper({ children }: { children: ReactNode }) {
  const { loading, drawer, setDrawer } = useGlobal();
  
  return (
    <>
      {children}
      {/* Login drawer temporarily disabled.
      <Suspense fallback={null}>
        <AuthDrawer isOpen={drawer} setIsOpen={setDrawer} />
      </Suspense>
      */}
    </>
  );
}

type NavigationData = { countries: any[]; courses: any[]; cities: any[] };

export default function ClientLayout({ children, navigationData }: { children: ReactNode; navigationData: NavigationData }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname?.startsWith("/admin/")) {
    return <main className="min-h-screen">{children}</main>;
  }
  const shouldHideLayout = hideLayoutOnPaths.includes(pathname || '');

  return (
    <ThemeProvider defaultTheme="light" storageKey="gateway-theme">
        <GlobalProvider>
          <BannerCategoryProvider>
          <LoaderWrapper>
            <ConsentAwareVisitorTracker />
            <CookieConsent />
            {!shouldHideLayout && (
                <Header countries={navigationData.countries} courses={navigationData.courses} />
            )}
            <main>{children}</main>
            {!shouldHideLayout && (
                <Footer courses={navigationData.courses} cities={navigationData.cities} countries={navigationData.countries} />
            )}
            <ContactDock />
            <RouteBannerPopup />
          </LoaderWrapper>
          </BannerCategoryProvider>
        </GlobalProvider>
    </ThemeProvider>
  );
}
