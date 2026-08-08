"use client";

import { ReactNode, Suspense, lazy } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalProvider, useGlobal } from "@/hooks/AppStateContext";
import { usePathname } from "next/navigation";
import Loader from "../loader";
import Header from "../header";
import { Footer } from "../footer";


// const Header = lazy(() => import("@/components/header"));
// const Footer = lazy(() => import("@/components/footer"));
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
                <Header />
            )}
            <main>{children}</main>
            {!shouldHideLayout && (
                <Footer />
            )}
          </LoaderWrapper>
        </GlobalProvider>
    </ThemeProvider>
  );
}