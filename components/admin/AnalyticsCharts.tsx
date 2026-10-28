"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ClipboardList, Globe2, MapPin, MonitorSmartphone } from "lucide-react";

type Point = { key: string; label: string; pageViews: number; visitors: number; sessions: number };
type Page = { path: string; views: number; visitors: number };
type Item = { name: string; views: number };
type Form = { name: string; count: number };

const number = new Intl.NumberFormat("en-IN");
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const chart = { left: 52, right: 24, top: 22, bottom: 260, width: 960 };
const plotWidth = chart.width - chart.left - chart.right;
const plotHeight = chart.bottom - chart.top;

function niceMaximum(value: number) {
  if (value <= 4) return 4;
  const rawStep = value / 4;
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 5, 10].map((factor) => factor * power).find((candidate) => candidate >= rawStep) || power * 10;
  return step * 4;
}

function pathFor(points: Point[], field: "pageViews" | "visitors", maximum: number) {
  return points.map((point, index) => `${index ? "L" : "M"}${chart.left + index / Math.max(points.length - 1, 1) * plotWidth},${chart.bottom - point[field] / maximum * plotHeight}`).join(" ");
}

function CardHeading({ eyebrow, title, detail, icon: Icon }: { eyebrow: string; title: string; detail: string; icon: typeof Globe2 }) {
  return <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#c41430]">{eyebrow}</p><h2 className="mt-1 text-lg font-bold text-[#202b3f]">{title}</h2><p className="mt-1 text-xs text-slate-500">{detail}</p></div><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-[#d81635]"><Icon className="h-4 w-4" /></span></div>;
}

export function TrafficChart({ points, range, summary }: { points: Point[]; range: 1 | 7 | 15; summary: { pageViews: number; visitors: number; sessions: number } }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maximum = niceMaximum(Math.max(0, ...points.map((point) => point.pageViews)));
  const viewsPath = pathFor(points, "pageViews", maximum);
  const visitorsPath = pathFor(points, "visitors", maximum);
  const activeIndex = hovered ?? Math.max(0, points.length - 1);
  const active = points[activeIndex];
  const activeX = chart.left + activeIndex / Math.max(points.length - 1, 1) * plotWidth;
  const labels = [0, 1, 2, 3, 4].map((index) => Math.round(index * Math.max(points.length - 1, 0) / 4));

  return <section className="overflow-hidden rounded-[22px] border border-[#e6eaf1] bg-white p-5 shadow-[0_10px_28px_-28px_rgba(31,41,55,0.25)] sm:p-7">
    <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#c41430]">Traffic pulse</p><h2 className="mt-1 text-xl font-bold text-[#202b3f]">Visitors and page views</h2><p className="mt-1 text-xs text-slate-500">{range === 1 ? "Hourly" : "Daily"} trend in IST</p></div><div className="flex flex-wrap gap-3 sm:gap-6"><div><p className="text-[11px] font-semibold text-slate-500">Unique visitors</p><p className="mt-1 text-2xl font-bold text-[#202b3f]">{number.format(summary.visitors)}</p></div><div className="border-l border-slate-200 pl-3 sm:pl-6"><p className="text-[11px] font-semibold text-slate-500">Page views</p><p className="mt-1 text-2xl font-bold text-[#d81635]">{number.format(summary.pageViews)}</p></div><div className="border-l border-slate-200 pl-3 sm:pl-6"><p className="text-[11px] font-semibold text-slate-500">Visits</p><p className="mt-1 text-2xl font-bold text-[#4c8dcb]">{number.format(summary.sessions)}</p></div></div></div>
    <div className="mt-6 flex items-center gap-5 text-[11px] font-semibold text-slate-500"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#d81635]" /> Page views</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#4c8dcb]" /> Visitors</span></div>
    <div className="relative mt-3 rounded-2xl bg-[#fafbfd] px-2 py-4 sm:px-4"><div className="pointer-events-none absolute right-5 top-4 z-10 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-[11px] shadow-sm backdrop-blur"><p className="font-bold text-[#202b3f]">{active?.label || "No period"}</p><p className="mt-1 text-[#d81635]">{number.format(active?.pageViews || 0)} views</p><p className="text-[#4c8dcb]">{number.format(active?.visitors || 0)} visitors</p></div>
      <svg viewBox="0 0 960 300" role="img" aria-label={`Traffic graph: ${summary.pageViews} page views and ${summary.visitors} unique visitors in ${range === 1 ? "24 hours" : `${range} days`}`} className="h-[250px] w-full sm:h-[320px]" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width * chart.width; setHovered(Math.max(0, Math.min(points.length - 1, Math.round((x - chart.left) / plotWidth * (points.length - 1))))); }} onPointerLeave={() => setHovered(null)}>
        <defs><linearGradient id="page-view-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f5a9b8" stopOpacity=".42" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
        {[0, 1, 2, 3, 4].map((index) => { const y = chart.top + index * plotHeight / 4; return <g key={index}><line x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} stroke="#e6eaf0" strokeDasharray={index === 4 ? undefined : "4 6"} /><text x={chart.left - 12} y={y + 4} textAnchor="end" fill="#8c98a9" fontSize="12">{number.format(maximum - index * maximum / 4)}</text></g>; })}
        <path d={`${viewsPath} L${chart.width - chart.right},${chart.bottom} L${chart.left},${chart.bottom} Z`} fill="url(#page-view-area)" />
        <motion.path d={viewsPath} fill="none" stroke="#d81635" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} />
        <motion.path d={visitorsPath} fill="none" stroke="#4c8dcb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }} />
        {active && <g><line x1={activeX} x2={activeX} y1={chart.top} y2={chart.bottom} stroke="#b6becb" strokeDasharray="4 5" /><circle cx={activeX} cy={chart.bottom - active.pageViews / maximum * plotHeight} r="6" fill="#d81635" stroke="white" strokeWidth="3" /><circle cx={activeX} cy={chart.bottom - active.visitors / maximum * plotHeight} r="6" fill="#4c8dcb" stroke="white" strokeWidth="3" /></g>}
        {labels.map((index, position) => <text key={`${position}-${index}`} x={chart.left + index / Math.max(points.length - 1, 1) * plotWidth} y="288" textAnchor={position === 0 ? "start" : position === 4 ? "end" : "middle"} fill="#8490a2" fontSize="12">{points[index]?.label}</text>)}
      </svg>
    </div>
    <p className="mt-3 text-[11px] text-slate-400">Move over the graph to inspect a period. Visitors are unique within each hour or day.</p>
  </section>;
}

export function TopPagesChart({ pages }: { pages: Page[] }) {
  const maximum = Math.max(1, ...pages.map((page) => page.views));
  return <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6"><CardHeading eyebrow="Content performance" title="Top visited pages" detail="Ranked by page views" icon={Globe2} />{pages.length ? <div className="mt-6 space-y-4">{pages.map((page, index) => <div key={page.path}><div className="flex items-center justify-between gap-3 text-xs"><div className="flex min-w-0 items-center gap-2"><span className="w-5 shrink-0 font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</span><a href={page.path} target="_blank" rel="noopener noreferrer" title={page.path} className="truncate font-semibold text-[#344158] hover:text-[#d81635]">{page.path}</a><ArrowUpRight className="h-3 w-3 shrink-0 text-slate-300" /></div><strong className="shrink-0 text-[#202b3f]">{number.format(page.views)}</strong></div><div className="ml-7 mt-2 h-2 overflow-hidden rounded-full bg-[#f1f3f7]"><motion.div initial={{ width: 0 }} animate={{ width: `${page.views / maximum * 100}%` }} transition={{ duration: 0.55, delay: index * 0.04 }} className="h-full rounded-full bg-gradient-to-r from-[#d81635] to-[#f38a9c]" /></div><p className="ml-7 mt-1 text-[10px] text-slate-400">{number.format(page.visitors)} unique visitors</p></div>)}</div> : <EmptyState label="No page visits in this period" />}</section>;
}

function countryLabel(code: string) {
  try { return regionNames.of(code) || code; } catch { return code; }
}

export function TopCountriesChart({ countries, cities }: { countries: Item[]; cities: Item[] }) {
  const maximum = Math.max(1, ...countries.map((country) => country.views));
  return <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6"><CardHeading eyebrow="Audience location" title="Top countries" detail="Location estimated from visitor IP addresses" icon={MapPin} />{countries.length ? <div className="mt-6 space-y-4">{countries.map((item, index) => <div key={item.name}><div className="flex justify-between gap-3 text-xs"><span className="truncate font-semibold text-[#344158]">{countryLabel(item.name)}</span><strong className="shrink-0 text-[#202b3f]">{number.format(item.views)} views</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1f3f7]"><motion.div initial={{ width: 0 }} animate={{ width: `${item.views / maximum * 100}%` }} transition={{ duration: 0.55, delay: index * 0.04 }} className="h-full rounded-full bg-gradient-to-r from-[#4c8dcb] to-[#8fc4f5]" /></div></div>)}</div> : <EmptyState label="No country data in this period" />}{cities.length > 0 && <div className="mt-6 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Top cities</p><div className="mt-3 flex flex-wrap gap-2">{cities.map((item) => <span key={item.name} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{item.name} <span className="text-slate-400">{number.format(item.views)}</span></span>)}</div></div>}</section>;
}

export function DevicesChart({ devices }: { devices: Item[] }) {
  const total = devices.reduce((sum, item) => sum + item.views, 0);
  const colors = ["#d81635", "#4c8dcb", "#f0aa57", "#94a3b8"];
  let offset = 0;
  const stops = devices.map((item, index) => { const start = offset; offset += total ? item.views / total * 100 : 0; return `${colors[index % colors.length]} ${start}% ${offset}%`; });
  return <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6"><CardHeading eyebrow="Platform mix" title="Devices" detail="Share of page views by device type" icon={MonitorSmartphone} /><div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-around"><div className="grid h-40 w-40 shrink-0 place-items-center rounded-full" role="img" aria-label={`Device share across ${number.format(total)} page views`} style={{ background: total ? `conic-gradient(${stops.join(", ")})` : "#eef1f5" }}><div className="grid h-[112px] w-[112px] place-content-center rounded-full bg-white text-center"><strong className="text-2xl text-[#202b3f]">{number.format(total)}</strong><span className="text-[10px] font-semibold text-slate-400">page views</span></div></div><div className="w-full max-w-[220px] space-y-3">{devices.length ? devices.map((item, index) => <div key={item.name} className="flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 capitalize font-semibold text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />{item.name}</span><strong className="text-[#202b3f]">{total ? Math.round(item.views / total * 100) : 0}%</strong></div>) : <p className="text-xs text-slate-400">No device data yet</p>}</div></div></section>;
}

export function FormsChart({ forms }: { forms: Form[] }) {
  const maximum = Math.max(1, ...forms.map((form) => form.count));
  return <section className="rounded-[22px] border border-[#e6eaf1] bg-white p-5 sm:p-6"><CardHeading eyebrow="Lead interest" title="Forms attempted" detail="Most common submitted form types" icon={ClipboardList} />{forms.length ? <div className="mt-6 space-y-5">{forms.map((item, index) => <div key={item.name}><div className="flex justify-between gap-3 text-xs"><span className="truncate font-semibold text-[#344158]" title={item.name}>{item.name}</span><strong className="shrink-0 text-[#202b3f]">{number.format(item.count)}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1f3f7]"><motion.div initial={{ width: 0 }} animate={{ width: `${item.count / maximum * 100}%` }} transition={{ duration: 0.55, delay: index * 0.05 }} className="h-full rounded-full bg-gradient-to-r from-[#e37d59] to-[#f5ba77]" /></div></div>)}</div> : <EmptyState label="No form attempts in this period" />}</section>;
}

function EmptyState({ label }: { label: string }) {
  return <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-xs font-medium text-slate-400">{label}</div>;
}
