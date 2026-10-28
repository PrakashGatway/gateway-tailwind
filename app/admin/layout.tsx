import type { ReactNode } from "react";
import "@fontsource-variable/montserrat/wght.css";

export const metadata = {
  title: "Admin | Gateway Abroad",
  robots: { index: false, follow: false },
};

export const runtime = "nodejs";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin-font font-medium">{children}</div>;
}
