import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe2, MousePointerClick, FilePenLine } from "lucide-react";
import { countryLabel, getVisitorTimeline } from "@/lib/admin/activity";

export const dynamic = "force-dynamic";

const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function VisitorPage({ params }: { params: Promise<{ visitorId: string }> }) {
  const { visitorId } = await params;
  if (!/^[a-f\d]{8}-[a-f\d]{4}-[1-8][a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(visitorId)) notFound();
  const { events, total } = await getVisitorTimeline(visitorId);
  if (!events.length) notFound();
  const latest = events[0];
  const sessions = new Set(events.map((event) => event.sessionId));

  return <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
    <Link href="/admin/activity" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d81635] hover:underline"><ArrowLeft className="h-4 w-4" /> All activity</Link>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d81635]">Visitor timeline</p><h1 className="mt-2 break-all font-mono text-xl font-bold text-[#1b2538] sm:text-2xl">{visitorId}</h1><div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-slate-100 px-3 py-1.5">{total} events</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{sessions.size} session{sessions.size === 1 ? "" : "s"}</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{sessions.size > 1 ? "Returning visitor" : "First session"}</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{countryLabel(latest.country)}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 font-mono">{latest.ip || "IP unavailable"}</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{latest.device}</span></div></div>
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold text-[#1b2538]">Activity history <span className="text-sm font-normal text-slate-400">(IST)</span></h2><div className="mt-6 space-y-0">{events.map((event) => {
      const Icon = event.type === "click" ? MousePointerClick : event.type === "form_start" || event.type === "form_submit" ? FilePenLine : Globe2;
      return <div key={String(event._id)} className="relative flex gap-4 border-l-2 border-slate-100 pb-7 pl-6 last:pb-0"><span className="absolute -left-[13px] top-0 grid h-6 w-6 place-items-center rounded-full bg-rose-50 text-[#d81635]"><Icon className="h-3.5 w-3.5" /></span><div className="min-w-0"><p className="text-xs text-slate-500">{formatter.format(event.occurredAt)} · {countryLabel(event.country)}</p><p className="mt-1 break-all text-sm font-semibold text-slate-800">{event.type === "page_view" ? "Opened" : event.type === "click" ? "Clicked" : event.type === "form_start" ? "Started" : "Submitted"} {event.label || event.path}</p>{event.label && <p className="mt-0.5 break-all text-xs text-slate-500">{event.path}</p>}<p className="mt-1 font-mono text-[10px] text-slate-400">Session {event.sessionId.slice(0, 8)}…</p></div></div>;
    })}</div>{total > events.length && <p className="mt-6 text-xs text-slate-500">Showing the latest {events.length} of {total} events.</p>}</section>
  </main>;
}
