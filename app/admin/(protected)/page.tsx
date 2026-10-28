import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  ClipboardList,
  FileText,
  Globe2,
  GraduationCap,
  Layers3,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { getAdminDashboard } from "@/lib/admin/dashboard";

export const dynamic = "force-dynamic";

const numberFormat = new Intl.NumberFormat("en-IN");
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();
  const stats = [
    {
      label: "Form submissions",
      value: data.forms,
      icon: ClipboardList,
      detail: "Enquiries received",
      tint: "bg-[#fff0f3] text-[#d81635]",
      line: "bg-[#ef6b84]",
    },
    {
      label: "Blogs",
      value: data.blogs,
      icon: BookOpenText,
      detail: "Stories and guides",
      tint: "bg-[#fff6e8] text-[#cc861b]",
      line: "bg-[#efba65]",
    },
    {
      label: "Articles",
      value: data.articles,
      icon: FileText,
      detail: "Editorial content",
      tint: "bg-[#eef6ff] text-[#468acb]",
      line: "bg-[#8cbbe8]",
    },
    {
      label: "Students",
      value: data.students,
      icon: GraduationCap,
      detail: "Student profiles",
      tint: "bg-[#f3efff] text-[#8670c8]",
      line: "bg-[#b8a9e9]",
    },
  ] as const;

  return (
    <main className="mx-auto max-w-[1440px] font-medium space-y-7 px-5 py-7 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#263247]">
            Dashboard
          </h1>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-[#e6e9f0] bg-white px-4 py-2.5 text-xs font-bold text-[#526079] -sm transition hover:border-[#f4bdc7] hover:text-[#c41430]"
        >
          Open website <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="relative isolate overflow-hidden rounded-[20px] border border-[#f4dce2] bg-gradient-to-br from-[#fff4f6] via-[#fffaf9] to-[#fffdfb] p-6 sm:p-8 xl:p-10">
        <div className="pointer-events-none absolute -right-14 -top-24 -z-10 h-80 w-80 rounded-full border-[50px] border-[#f9d5dc]/35" />
        <div className="pointer-events-none absolute bottom-[-170px] right-[25%] -z-10 h-72 w-72 rounded-full bg-[#ffe7dc]/40 blur-3xl" />
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <div>
       
            <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#263247] ">
              Every student journey starts with a conversation.
            </h2>
            <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-[#68758a]">
              Keep the important numbers close, see what was published recently,
              and follow how visitors move through your website.
            </p>
            <Link
              href="/admin/activity"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d81635] px-5 py-3 text-sm font-bold text-white -[0_12px_22px_-12px_rgba(216,22,53,0.75)] transition hover:-translate-y-0.5 hover:bg-[#b9132d] hover:-[0_16px_28px_-13px_rgba(216,22,53,0.75)]"
            >
              Explore visitor activity <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-[22px] border border-white bg-white/85 p-5 -[0_18px_45px_-28px_rgba(116,67,83,0.28)] backdrop-blur sm:p-6">
            
            <div className="divide-y divide-[#eff0f4]">
              <div className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3 text-sm font-medium text-[#637085]">
                  <span className="h-2 w-2 rounded-full bg-[#e87c92]" />{" "}
                  Enquiries
                </span>
                <strong className="text-xl text-[#263247]">
                  {numberFormat.format(data.forms)}
                </strong>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3 text-sm font-medium text-[#637085]">
                  <span className="h-2 w-2 rounded-full bg-[#8db9e7]" />{" "}
                  Published content
                </span>
                <strong className="text-xl text-[#263247]">
                  {numberFormat.format(data.blogs + data.articles)}
                </strong>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="flex items-center gap-3 text-sm font-medium text-[#637085]">
                  <span className="h-2 w-2 rounded-full bg-[#b8a8ea]" /> Student
                  profiles
                </span>
                <strong className="text-xl text-[#263247]">
                  {numberFormat.format(data.students)}
                </strong>
              </div>
            </div>
          
          </div>
        </div>
      </section>

      <section aria-labelledby="snapshot-title">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#a0a8b5]">
              At a glance
            </p>
            <h2
              id="snapshot-title"
              className="mt-0.5 text-lg font-bold text-[#263247]"
            >
              Workspace snapshot
            </h2>
          </div>
          <span className="rounded-full border border-[#e9eaf1] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#8a95a5]">
            Live database
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, detail, tint, line }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-[22px] border border-[#e9eaf1] bg-white p-5 -[0_10px_30px_-24px_rgba(31,41,55,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#e5dce3] hover:-[0_20px_45px_-28px_rgba(31,41,55,0.32)]"
            >
              <span
                className={`absolute left-5 right-5 top-0 h-[3px] rounded-b-full ${line}`}
              />
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-[#68758a]">
                  {label}
                </span>
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ${tint}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-5 text-[32px] font-bold leading-none tracking-tight text-[#263247]">
                {numberFormat.format(value)}
              </p>
              <p className="mt-2 text-xs text-[#9aa4b2]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.9fr)]">
        <section className="overflow-hidden rounded-[24px] border border-[#e9eaf1] bg-white -[0_12px_36px_-28px_rgba(31,41,55,0.23)]">
          <div className="flex items-center justify-between border-b border-[#eff0f4] px-6 py-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d81635]">
                Latest updates
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#263247]">
                Recent content
              </h2>
            </div>
            <span className="rounded-full bg-[#f6f7fa] px-3 py-1.5 text-[11px] font-semibold text-[#8490a1]">
              Latest 5
            </span>
          </div>
          {data.recent.length ? (
            <ul className="divide-y divide-[#f0f1f5]">
              {data.recent.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 px-6 py-4 transition hover:bg-[#fafbfe]"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ${item.type === "Blog" ? "bg-[#fff0f3] text-[#d81635]" : "bg-[#eef6ff] text-[#4c8dcb]"}`}
                    >
                      {item.type === "Blog" ? (
                        <BookOpenText className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[#334057] transition group-hover:text-[#c41430]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs text-[#9aa4b2]">
                        {item.type} ·{" "}
                        {item.createdAt
                          ? dateFormat.format(new Date(item.createdAt))
                          : "Date unavailable"}
                      </span>
                    </span>
                    <MoveUpRight className="h-4 w-4 shrink-0 text-[#b8c0cb] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d81635]" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <BookOpenText className="mx-auto h-7 w-7 text-[#b9c2cf]" />
              <p className="mt-3 text-sm font-medium text-[#718096]">
                No recent content yet
              </p>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="relative overflow-hidden rounded-[24px] border border-[#f3d8df] bg-gradient-to-br from-[#fff6f8] to-[#fffdfb] p-6 -[0_12px_36px_-28px_rgba(198,48,74,0.23)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[28px] border-[#f9d6dd]/40" />
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-[#d81635] -sm">
              <Activity className="h-5 w-5" />
            </span>
            <h2 className="relative mt-5 text-xl font-bold text-[#263247]">
              Follow every visitor journey
            </h2>
            <p className="relative mt-2 text-sm leading-6 text-[#718096]">
              Explore page visits, clicks, form activity, and returning visitors
              in one timeline.
            </p>
            <Link
              href="/admin/activity"
              className="relative mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#c41430] transition hover:gap-3"
            >
              Open visitor activity <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
          <section className="rounded-[24px] border border-[#e9eaf1] bg-white p-6 -[0_12px_36px_-28px_rgba(31,41,55,0.23)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#a0a8b5]">
              Quick access
            </p>
            <h2 className="mt-1 text-lg font-bold text-[#263247]">
              Your website
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#8490a1]">
              Open the public site to review content and the visitor experience.
            </p>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-between rounded-[14px] border border-[#eef0f4] bg-[#fafbfd] px-4 py-3 text-sm font-semibold text-[#526079] transition hover:border-[#f1c7d0] hover:bg-[#fff8f9] hover:text-[#c41430]"
            >
              <span className="flex items-center gap-2">
                <Globe2 className="h-4 w-4" /> View website
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
