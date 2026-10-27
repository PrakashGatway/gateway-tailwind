import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart3, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <div className="grid min-h-screen bg-[#f7f8fb] lg:grid-cols-[minmax(0,0.74fr)_minmax(0,0.96fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#1c263a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[450px] w-[450px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-3 top-8 h-[330px] w-[330px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[-140px] h-[500px] w-[500px] rounded-full bg-[#d81635]/20 blur-[90px]" />
        <Link href="/" className="relative flex w-fit items-center gap-3">
        <img src="/images/logo.svg" alt="" className="w-48"  />
           </Link>
        <div className="relative max-w-xl pb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-rose-100"><ShieldCheck className="h-4 w-4" /> Secure management</span>
          <h1 className="mt-7 text-5xl font-bold leading-[1.1] tracking-tight">Your command center for <span className="text-[#ff667f]">what’s next.</span></h1>
          <p className="mt-6 max-w-md text-base leading-8 text-slate-300">Manage your Gateway Abroad workspace with a clear overview of content, students, and enquiries.</p>
          <div className="mt-12 flex gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/10"><BarChart3 className="h-5 w-5 text-rose-200" /></span>
            <span><span className="block text-sm font-semibold">One place for your overview</span><span className="mt-1 block text-sm text-slate-400">Live data from your existing database</span></span>
          </div>
        </div>
        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} Gateway Abroad Education</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Image src="/images/logo.svg" alt="Gateway Abroad" width={140} height={54} priority />
            <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#b91c3b]">Admin</span>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#d81635]"><ArrowLeft className="h-4 w-4" /> Back to website</Link>
          <div className="mt-10 grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-[#d81635]"><LockKeyhole className="h-6 w-6" /></div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#1b2538]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your admin credentials to continue.</p>
          <AdminLoginForm />
        </div>
      </section>
    </div>
  );
}
