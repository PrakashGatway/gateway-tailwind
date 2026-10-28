"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type UIEvent,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  FilePenLine,
  Globe2,
  LoaderCircle,
  MousePointerClick,
  UserRound,
  X,
} from "lucide-react";
import type { VisitorSummary } from "@/lib/admin/visitors";
import type { ActivityType, LeadSnapshot } from "@/lib/analytics";

type TimelineEvent = {
  id: string;
  type: ActivityType;
  path: string;
  label: string;
  occurredAt: string;
  sessionId: string;
  country: string | null;
  city: string | null;
  ip: string | null;
  lead: LeadSnapshot | null;
  durationMs: number | null;
};
type TimelineResponse = { events: TimelineEvent[]; nextCursor: string | null };

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "2-digit",
  timeZone: "Asia/Kolkata",
});
const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});
const fullFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const fieldLabels: Record<string, string> = {
  name: "Name",
  fullname: "Full name",
  firstname: "First name",
  lastname: "Last name",
  email: "Email",
  emailid: "Email",
  phone: "Phone",
  mobile: "Mobile",
  mobileno: "Mobile",
  phonenumber: "Phone",
  city: "City",
  state: "State",
  country: "Country",
  destinationcountry: "Study destination",
  countrytostudy: "Country to study",
  programlevel: "Program level",
  course: "Course",
  coursesubject: "Course",
  intake: "Intake",
  intakeyear: "Intake year",
  testtype: "Test type",
};

function countryLabel(country: string | null) {
  if (!country) return "Unknown country";
  try {
    return regionNames.of(country) || country;
  } catch {
    return country;
  }
}

function locationLabel(city: string | null, country: string | null) {
  if (!city) return countryLabel(country);
  return country ? `${city}, ${countryLabel(country)}` : city;
}

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function eventMeta(type: ActivityType) {
  switch (type) {
    case "page_view":
      return {
        title: "Page opened",
        Icon: Globe2,
        tone: "text-blue-600 bg-blue-50 border-blue-200",
        badge: "Page view",
      };
    case "page_duration":
      return {
        title: "Time on page",
        Icon: Clock3,
        tone: "text-cyan-700 bg-cyan-50 border-cyan-200",
        badge: "Visible time",
      };
    case "click":
      return {
        title: "Button or link clicked",
        Icon: MousePointerClick,
        tone: "text-violet-600 bg-violet-50 border-violet-200",
        badge: "Click",
      };
    case "form_start":
      return {
        title: "Form started",
        Icon: FilePenLine,
        tone: "text-amber-600 bg-amber-50 border-amber-200",
        badge: "Form",
      };
    case "form_submit":
      return {
        title: "Form submitted",
        Icon: FilePenLine,
        tone: "text-emerald-600 bg-emerald-50 border-emerald-200",
        badge: "Form attempt",
      };
  }
}

export default function VisitorList({
  visitors,
}: {
  visitors: VisitorSummary[];
}) {
  const [selected, setSelected] = useState<VisitorSummary | null>(null);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loadingRef = useRef(false);
  const requestRef = useRef<AbortController | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openVisitor(visitor: VisitorSummary) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelected(visitor);
    setOpen(true);
  }

  function closeVisitor() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(false);
    closeTimer.current = setTimeout(() => setSelected(null), 220);
  }

  const loadPage = useCallback(
    (visitorId: string, cursor: string | null, append: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError("");
      const controller = new AbortController();
      requestRef.current = controller;
      const url = `/api/admin/activity/${visitorId}${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`;
      void fetch(url, { signal: controller.signal, cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error("Could not load activity");
          return response.json() as Promise<TimelineResponse>;
        })
        .then((data) => {
          if (controller.signal.aborted) return;
          setEvents((current) =>
            append ? [...current, ...data.events] : data.events,
          );
          setNextCursor(data.nextCursor);
        })
        .catch((reason) => {
          if (!controller.signal.aborted)
            setError(
              reason instanceof Error
                ? reason.message
                : "Could not load activity",
            );
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            loadingRef.current = false;
            setLoading(false);
          }
        });
    },
    [],
  );

  useEffect(() => {
    requestRef.current?.abort();
    loadingRef.current = false;
    setEvents([]);
    setNextCursor(null);
    setError("");
    if (selected) loadPage(selected.id, null, false);
    return () => requestRef.current?.abort();
  }, [selected?.id, loadPage]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  function onTimelineScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    if (
      selected &&
      nextCursor &&
      !loadingRef.current &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 280
    ) {
      loadPage(selected.id, nextCursor, true);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[#f8faff] text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-6 py-3.5">Visitor</th>
              <th className="px-5 py-3.5">Latest activity</th>
              <th className="px-5 py-3.5">Location</th>
              <th className="px-5 py-3.5">Journey</th>
              <th className="px-5 py-3.5">
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitors.map((visitor) => (
              <tr
                key={visitor.id}
                data-visitor-id={visitor.id}
                className="group cursor-pointer transition-colors hover:bg-[#f6f9ff]"
                onClick={() => openVisitor(visitor)}
              >
                <td className="px-6 py-3">
                  <button
                    type="button"
                    className="flex items-center gap-3 text-left focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d81635]"
                    onClick={(event) => {
                      event.stopPropagation();
                      openVisitor(visitor);
                    }}
                    aria-label={`Open activity for ${visitor.name || visitor.id}`}
                  >
                    
                    <span className="min-w-0">
                      <span className="block max-w-[250px] capitalize truncate text-sm font-bold text-[#1b2538]">
                        {visitor.name || `Device ${visitor.id.slice(0, 8)}…`}
                      </span>
                      <span className="mt-1 block font-mono text-[11px] text-slate-400">
                        {visitor.id}
                      </span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className="block text-sm font-semibold text-slate-700">
                    {fullFormatter.format(new Date(visitor.lastSeen))}
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    IST · {visitor.device}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="block text-sm font-medium text-slate-700">
                    {locationLabel(visitor.city, visitor.country)}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-slate-400">
                    {visitor.ip || "IP unavailable"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                      {visitor.events} events
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                      {visitor.pageViews} page views
                    </span>
                    {visitor.formStarts > 0 && (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                        {visitor.formStarts} forms started
                      </span>
                    )}
                    {visitor.timeSpentMs > 0 && (
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700">
                        {formatDuration(visitor.timeSpentMs)} on pages
                      </span>
                    )}
                    {visitor.forms > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {visitor.forms} forms
                      </span>
                    )}
                    {visitor.sessions > 1 && (
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-[#c41430]">
                        Returning
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#d81635]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visitors.length && (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <UserRound className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">
              No visitors match these filters
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try a wider date range or reset the filters.
            </p>
          </div>
        )}
      </div>

      <Dialog.Root
        open={open}
        onOpenChange={(value) => {
          if (!value) closeVisitor();
        }}
      >
        {selected && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay
              forceMount
              className="fixed inset-0 z-50 bg-[#101a2b]/30 duration-200 data-[state=closed]:pointer-events-none"
            />
            <Dialog.Content
              forceMount
              className="admin-font fixed left-1/2 top-1/2 z-50 flex h-[min(90vh,900px)] w-[min(1060px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[20px] border border-white/70 bg-[#f9fbff] outline-none "
            >
              <div className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
                <div className="absolute -right-12 -top-20 h-44 w-44 rounded-full bg-rose-100/70 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                   
                    <Dialog.Title className="mt-1 truncate capitalize text-xl font-semibold text-[#1b2538]">
                      {selected.name || `Device ${selected.id.slice(0, 12)}…`}
                    </Dialog.Title>
                    <Dialog.Description className="mt-px break-all font-medium text-[11px] text-slate-400">
                      {selected.id}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:rotate-90 hover:bg-rose-50 hover:text-[#d81635]"
                    aria-label="Close activity"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <div className="relative mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                    {selected.events} events in range
                  </span>
                  {selected.timeSpentMs > 0 && (
                    <span className="rounded-full bg-cyan-50 px-3 py-1.5 font-semibold text-cyan-700">
                      {formatDuration(selected.timeSpentMs)} visible time
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                    {selected.sessions} session
                    {selected.sessions === 1 ? "" : "s"}
                  </span>
                  {selected.forms > 0 && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                      {selected.forms} form attempts
                    </span>
                  )}
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-600">
                    {locationLabel(selected.city, selected.country)}
                  </span>
                </div>
              </div>
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8"
                onScroll={onTimelineScroll}
              >
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                  >
                    {error}{" "}
                    <button
                      type="button"
                      className="ml-2 font-bold underline"
                      onClick={() =>
                        loadPage(selected.id, nextCursor, events.length > 0)
                      }
                    >
                      Retry
                    </button>
                  </div>
                )}
                <div className="relative pl-10 before:absolute before:bottom-0 before:left-[18px] before:top-5 before:w-[2px] before:bg-gradient-to-b before:from-[#7aaeff] before:via-[#9cc3ff] before:to-transparent sm:pl-12">
                  {events.map((event, index) => {
                    const date = dateFormatter.format(
                      new Date(event.occurredAt),
                    );
                    const previousDate =
                      index > 0
                        ? dateFormatter.format(
                            new Date(events[index - 1].occurredAt),
                          )
                        : null;
                    const meta = eventMeta(event.type);
                    const Icon = meta.Icon;
                    return (
                      <Fragment key={event.id}>
                        {date !== previousDate && (
                          <h3 className="relative mb-3 mt-2 text-sm font-bold text-slate-700 first:mt-0">
                            {date}
                          </h3>
                        )}
                        <motion.article
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.28,
                            delay: Math.min(index % 24, 8) * 0.018,
                          }}
                          className="relative mb-3 rounded-2xl border border-[#d2dff0] bg-[#edf5ff] p-4"
                        >
                          <span
                            className={`absolute -left-[42px] top-4 grid h-10 w-10 place-items-center rounded-full border-2 bg-white shadow-sm sm:-left-[50px] ${meta.tone}`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="flex flex-wrap items-start justify-between">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-[#1c2c47]">
                                {meta.title}
                              </span>
                              <span className="rounded-full border border-white bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                                {meta.badge}
                              </span>
                            </div>
                            <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                              {timeFormatter.format(new Date(event.occurredAt))}
                            </span>
                          </div>
                          <p className=" break-words text-sm text-slate-700">
                            {event.type === "page_view" || event.type === "page_duration"
                              ? event.path
                              : event.label || event.path}
                          </p>
                          {event.type === "page_duration" && event.durationMs !== null && (
                            <p className="mt-1 text-sm font-bold text-cyan-700">
                              {formatDuration(event.durationMs)} visible on this page
                            </p>
                          )}
                          {event.type !== "page_view" && event.type !== "page_duration" && (
                            <p className="mt-1 break-all text-xs text-slate-500">
                              On {event.path}
                            </p>
                          )}
                          {event.type === "form_submit" &&
                            event.lead &&
                            event.lead.fields.length > 0 && (
                              <div className="mt-1 rounded-xl border border-[#d9e5f3] bg-white/80 p-3.5">
                                <p className="mb-3 mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#d81635]">
                                  Submitted details
                                </p>
                                <dl className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
                                  {event.lead.fields.map(
                                    (field, fieldIndex) => (
                                      <div
                                        key={`${field.key}-${fieldIndex}`}
                                        className="min-w-0"
                                      >
                                        <dt className="text-[11px] text-slate-400">
                                          {fieldLabels[field.key] || field.key}
                                        </dt>
                                        <dd className="mt-1 break-words text-xs font-semibold text-slate-700">
                                          {field.value}
                                        </dd>
                                      </div>
                                    ),
                                  )}
                                </dl>
                              </div>
                            )}
                          <p className=" font-mono text-[10px] text-slate-400">
                            Session {event.sessionId.slice(0, 8)}…
                          </p>
                        </motion.article>
                      </Fragment>
                    );
                  })}
                </div>
                {loading && (
                  <div className="flex items-center justify-center gap-2 py-7 text-sm text-slate-500">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#d81635]" />{" "}
                    Loading activity…
                  </div>
                )}
                {!loading && !error && events.length === 0 && (
                  <p className="py-12 text-center text-sm text-slate-500">
                    No activity remains for this visitor.
                  </p>
                )}
                {!loading && !nextCursor && events.length > 0 && (
                  <p className="py-7 text-center text-xs font-medium text-slate-400">
                    You’ve reached the beginning of this visitor’s 15-day
                    history.
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-3 text-xs text-slate-500 sm:px-8">
                <span>Times shown in IST · Records expire after 15 days</span>
                <span>{events.length} loaded</span>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </Dialog.Root>
    </>
  );
}
