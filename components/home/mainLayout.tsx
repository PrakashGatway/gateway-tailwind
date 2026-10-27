"use client";

import { ReactNode, Suspense, lazy } from "react";
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


// const Header = lazy(() => import("@/components/header"));
// const Footer = lazy(() => import("@/components/footer"));
// Login is temporarily disabled. Restore this import with the drawer below.
// const AuthDrawer = lazy(() => import("../auth/drawer"));

const hideLayoutOnPaths = ['/thank-you'];

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

export default function ClientLayout({ children }: { children: ReactNode }) {
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
            <VisitorTracker />
            {!shouldHideLayout && (
                <Header />
            )}
            <main>{children}</main>
            {!shouldHideLayout && (
                <Footer />
            )}
            <ContactDock />
            <RouteBannerPopup />
          </LoaderWrapper>
          </BannerCategoryProvider>
        </GlobalProvider>
    </ThemeProvider>
  );
}
