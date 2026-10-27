"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import type { AdminIdentity } from "@/lib/admin/session";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/activity", label: "Visitor activity", icon: Activity },
];

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminIdentity;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const currentSection = pathname.startsWith("/admin/activity")
    ? "Visitor activity"
    : "Dashboard";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError("");
    try {
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Sign out failed");
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setSignOutError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col border-r border-[#e9e9f0] bg-[#fcfcfe] text-[#273149]">
      <div className="border-b border-[#ececf2] px-5 pb-4 pt-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href="/admin"
            className="block min-w-0"
            onClick={() => setMenuOpen(false)}
            aria-label="Gateway Abroad admin home"
          >
            <img
              src="/images/logo.svg"
              alt="Gateway Abroad"
              className="h-auto w-36 max-w-full"
            />
          </Link>
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-7"
        aria-label="Admin navigation"
      >
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca4b3]">
          Overview
        </p>
        <div className="mt-3 space-y-1.5">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={`group relative flex items-center gap-3 rounded-[14px] px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${active ? "bg-[#fff0f3] text-[#c91534] shadow-[inset_0_0_0_1px_rgba(216,22,53,0.08)]" : "text-[#687287] hover:bg-white hover:text-[#263247] hover:shadow-sm"}`}
              >
                {active && (
                  <span className="absolute bottom-3 left-0 top-3 w-[4px] rounded-r-full bg-[#d81635]" />
                )}
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${active ? "bg-white text-[#d81635] shadow-sm" : "bg-[#f0f2f7] text-[#728096] group-hover:bg-[#fff1f4] group-hover:text-[#d81635]"}`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight className="h-4 w-4 text-[#d81635]/70" />
                )}
              </Link>
            );
          })}
        </div>

        <p className="mt-9 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9ca4b3]">
          Quick access
        </p>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-3 flex items-center gap-3 rounded-[14px] px-3.5 py-2 text-sm font-semibold text-[#687287] transition hover:bg-white hover:text-[#263247] hover:shadow-sm"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0f2f7] text-[#728096] transition group-hover:bg-[#e9f3ff] group-hover:text-[#3f7fc4]">
            <Globe2 className="h-[18px] w-[18px]" />
          </span>
          <span className="flex-1">View website</span>
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        </Link>
      </nav>

      <div className=" p-4">
        <div className="rounded-[18px] border border-[#e9e9f1] bg-white p-3.5 shadow-[0_8px_28px_-22px_rgba(31,41,55,0.35)]">
          <div className="flex items-center gap-3">

            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#273149]">
                {admin.name}
              </span>
              <span className="block truncate text-[11px] text-[#8a95a5]">
                {admin.email}
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ececf2] bg-[#fafbfd] px-3 py-2.5 text-xs font-semibold text-[#687287] transition hover:border-[#f4c9d1] hover:bg-[#fff0f3] hover:text-[#c41430] disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />{" "}
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
          {signOutError && (
            <p role="alert" className="mt-2 text-xs text-[#c41430]">
              {signOutError}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#263247]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[262px] lg:block">
        {sidebar}
      </aside>
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#17243d]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform shadow-2xl transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        {sidebar}
      </aside>

      <div className="lg:pl-[262px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between gap-4 border-b border-[#e9eaf1] bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e9eaf1] text-[#526079] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ca4b3]">
                Gateway Abroad / Admin
              </p>
              <p className="truncate text-sm font-bold text-[#263247]">
                {currentSection}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-[#dcf2e5] bg-[#f1fbf5] px-3 py-2 text-[11px] font-semibold text-[#277454] md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#39a879]" /> Secure
              session
            </span>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#e9eaf1] text-[#687287] transition hover:border-[#f2b9c4] hover:text-[#d81635]"
              aria-label="View website"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <span
              className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f3] text-xs font-bold text-[#c41430]"
              title={admin.name}
            >
              {(admin.name || "A").slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
