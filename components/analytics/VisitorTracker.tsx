"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type LeadField = { key: string; value: string };
type ClickKind = "whatsapp" | "phone" | "button" | "link";
type QueuedEvent = { type: "page_view" | "page_duration" | "click" | "form_start" | "form_submit"; path: string; label: string; at: number; durationMs?: number; clickKind?: ClickKind; clickTarget?: string; lead?: { name?: string; email?: string; phone?: string; fields: LeadField[] } };
type VisitorIdentity = { id: string; lastSeen: number };

const ID_KEY = "gateway_visitor_v1";
const SESSION_KEY = "gateway_session_v1";
const IDLE_LIMIT = 15 * 24 * 60 * 60 * 1000;
const SESSION_IDLE_LIMIT = 30 * 60 * 1000;
const ENDPOINT = "/api/analytics/collect";
const uuidPattern = /^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i;
const allowedFields = new Set(["name", "fullname", "firstname", "lastname", "email", "emailid", "phone", "mobile", "mobileno", "phonenumber", "city", "state", "country", "destinationcountry", "countrytostudy", "programlevel", "course", "coursesubject", "intake", "intakeyear", "testtype"]);

function getIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(ID_KEY) || "null") as VisitorIdentity | null;
    const now = Date.now();
    const visitorId = stored?.id && uuidPattern.test(stored.id) && Number.isFinite(stored.lastSeen) && now - stored.lastSeen < IDLE_LIMIT
      ? stored.id
      : crypto.randomUUID();
    localStorage.setItem(ID_KEY, JSON.stringify({ id: visitorId, lastSeen: now }));
    const storedSession = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null") as VisitorIdentity | null;
    const sessionId = storedSession?.id && uuidPattern.test(storedSession.id) && Number.isFinite(storedSession.lastSeen) && now - storedSession.lastSeen < SESSION_IDLE_LIMIT
      ? storedSession.id
      : crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: sessionId, lastSeen: now }));
    return { visitorId, sessionId };
  } catch {
    return { visitorId: crypto.randomUUID(), sessionId: crypto.randomUUID() };
  }
}

function safeLabel(value: string) {
  return value.replace(/\s+/g, " ").replace(/\b\S+@\S+\b/g, "[email]").replace(/\b\+?\d[\d\s()-]{7,}\d\b/g, "[number]").trim().slice(0, 100);
}

function clickDetails(control: Element): { clickKind: ClickKind; clickTarget: string } {
  const element = control as HTMLElement;
  const explicit = element.dataset.trackKind;
  const explicitTarget = element.dataset.trackTarget?.slice(0, 100) || "";
  if (explicit === "whatsapp" || explicit === "phone" || explicit === "button" || explicit === "link") {
    return { clickKind: explicit, clickTarget: explicitTarget };
  }
  const href = control.getAttribute("href") || "";
  if (/^tel:/i.test(href)) return { clickKind: "phone", clickTarget: `tel:${href.slice(4).replace(/[^\d+]/g, "").slice(0, 20)}` };
  if (href) {
    try {
      const url = new URL(href, location.origin);
      const host = url.hostname.toLowerCase();
      if (["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(host)) {
        const rawNumber = host === "wa.me" ? url.pathname.split("/")[1] : url.searchParams.get("phone") || url.pathname.split("/")[1];
        return { clickKind: "whatsapp", clickTarget: `whatsapp:${(rawNumber || "").replace(/\D/g, "").slice(0, 18)}` };
      }
      return { clickKind: "link", clickTarget: host === location.hostname ? url.pathname.slice(0, 100) : `external:${host.slice(0, 85)}` };
    } catch { return { clickKind: "link", clickTarget: "" }; }
  }
  return { clickKind: "button", clickTarget: (element.id ? `button:${element.id}` : "").slice(0, 100) };
}

function formName(form: HTMLFormElement) {
  const explicit = form.dataset.trackForm || form.getAttribute("aria-label") || form.id;
  if (explicit) return safeLabel(explicit);
  const heading = form.closest("section, dialog, article")?.querySelector("h1, h2, h3, h4")?.textContent;
  return safeLabel(heading || "Website form");
}

function formLead(form: HTMLFormElement) {
  const fields: LeadField[] = [];
  for (const control of Array.from(form.elements)) {
    if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement)) continue;
    if (!control.name || control.disabled || ["password", "hidden", "file", "checkbox", "radio"].includes(control.type)) continue;
    const key = control.name.toLowerCase().replace(/[^a-z]/g, "");
    if (!allowedFields.has(key)) continue;
    const value = control.value.trim().slice(0, 120);
    if (value && !fields.some((item) => item.key === key)) fields.push({ key, value });
    if (fields.length === 16) break;
  }
  const get = (...keys: string[]) => fields.find((field) => keys.includes(field.key))?.value;
  const name = get("name", "fullname") || [get("firstname"), get("lastname")].filter(Boolean).join(" ");
  return { name: name || undefined, email: get("email", "emailid"), phone: get("phone", "mobile", "mobileno", "phonenumber"), fields };
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const identity = useRef<{ visitorId: string; sessionId: string } | null>(null);
  const pending = useRef<QueuedEvent[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushRef = useRef<(beacon?: boolean) => void>(() => {});
  const lastPath = useRef<string | null>(null);
  const activeSince = useRef<number | null>(null);
  const finishPageRef = useRef<() => void>(() => {});

  useEffect(() => {
    identity.current = getIds();
    const startedForms = new WeakSet<HTMLFormElement>();

    function flush(beacon = false) {
      if (!identity.current || !pending.current.length) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      const events = pending.current.splice(0, 20);
      try {
        const now = Date.now();
        localStorage.setItem(ID_KEY, JSON.stringify({ id: identity.current.visitorId, lastSeen: now }));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: identity.current.sessionId, lastSeen: now }));
      } catch {}
      const body = JSON.stringify({ ...identity.current, events });
      if (beacon && navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => { /* Analytics never interrupts navigation or forms. */ });
      if (pending.current.length) timer.current = setTimeout(() => flush(), 1000);
    }
    flushRef.current = flush;

    function queue(type: QueuedEvent["type"], label: string, lead?: QueuedEvent["lead"], path = location.pathname, durationMs?: number, click?: { clickKind: ClickKind; clickTarget: string }) {
      if (lead && pending.current.length) flush();
      pending.current.push({ type, label: safeLabel(label), path, at: Date.now(), ...(lead ? { lead } : {}), ...(durationMs !== undefined ? { durationMs } : {}), ...(click || {}) });
      if (lead) flush(true);
      else if (pending.current.length >= 20) flush();
      else if (!timer.current) timer.current = setTimeout(() => flush(), 1000);
    }

    function finishPage() {
      const started = activeSince.current;
      activeSince.current = null;
      if (started === null || !lastPath.current) return;
      const durationMs = Math.round(performance.now() - started);
      if (durationMs >= 1000) queue("page_duration", "", undefined, lastPath.current, durationMs);
    }
    finishPageRef.current = finishPage;
    if (lastPath.current && document.visibilityState === "visible" && activeSince.current === null) {
      activeSince.current = performance.now();
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const control = target.closest("button, a, [role='button']");
      if (!control || control.closest("[data-no-track]")) return;
      const element = control as HTMLElement;
      const label = element.dataset.trackLabel || element.getAttribute("aria-label") || element.textContent || element.getAttribute("title") || control.tagName.toLowerCase();
      queue("click", label, undefined, location.pathname, undefined, clickDetails(control));
    }

    function onSubmit(event: SubmitEvent) {
      if (event.target instanceof HTMLFormElement && !event.target.closest("[data-no-track]")) {
        queue("form_submit", formName(event.target), formLead(event.target));
      }
    }

    function onFormFocus(event: FocusEvent) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
      const form = target.closest("form");
      if (!form || form.closest("[data-no-track]") || startedForms.has(form)) return;
      startedForms.add(form);
      queue("form_start", formName(form));
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        finishPage();
        flush(true);
      } else if (lastPath.current && activeSince.current === null) {
        activeSince.current = performance.now();
      }
    }
    function onPageHide() { finishPage(); flush(true); }
    function onPageShow() {
      if (document.visibilityState === "visible" && lastPath.current && activeSince.current === null) activeSince.current = performance.now();
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("focusin", onFormFocus, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("focusin", onFormFocus, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      finishPage();
      flush(true);
    };
  }, []);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    finishPageRef.current();
    lastPath.current = pathname;
    activeSince.current = document.visibilityState === "visible" ? performance.now() : null;
    pending.current.push({ type: "page_view", label: "", path: pathname, at: Date.now() });
    if (!timer.current) timer.current = setTimeout(() => flushRef.current(), 1000);
  }, [pathname]);

  return null;
}
