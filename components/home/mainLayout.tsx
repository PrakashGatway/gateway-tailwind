"use client";

import { ReactNode, Suspense, lazy } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalProvider, useGlobal } from "@/hooks/AppStateContext";
import { usePathname } from "next/navigation";
import Loader from "../loader";

const Header = lazy(() => import("@/components/header"));
const Footer = lazy(() => import("@/components/footer"));
const AuthDrawer = lazy(() => import("../auth/drawer"));

const hideLayoutOnPaths = ['/thank-you'];

const LayoutFallback = () => (
  null
);

function LoaderWrapper({ children }: { children: ReactNode }) {
  const { loading, drawer, setDrawer } = useGlobal();

  return (
    <>
      {children}
      {loading && <Loader />}
      <Suspense fallback={null}>
        <AuthDrawer isOpen={drawer} setIsOpen={setDrawer} />
      </Suspense>
    </>
  );
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldHideLayout = hideLayoutOnPaths.includes(pathname || '');

  return (
    <ThemeProvider defaultTheme="light" storageKey="gateway-theme">
      <GlobalProvider>
        <LoaderWrapper>
          {!shouldHideLayout && (
            <Suspense fallback={<LayoutFallback />}>
              <Header />
            </Suspense>
          )}
          <main>{children}</main>
          {/* {!shouldHideLayout && (
             <Suspense fallback={<LayoutFallback />}>
              <Footer />
            </Suspense>
          )} */}
        </LoaderWrapper>
      </GlobalProvider>
    </ThemeProvider>
  );
}