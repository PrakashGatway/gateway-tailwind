import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export type PolicySection = { title: string; paragraphs?: string[]; bullets?: string[] };

export default function PolicyPage({ title, intro, updated, sections }: { title: string; intro: string; updated?: string; sections: PolicySection[] }) {
  return (
    <main className="min-h-screen bg-[#faf8f8] pb-16 pt-28 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#84192d] via-[#b51e37] to-[#d71635] px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20"><ShieldCheck className="h-6 w-6" /></span>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">Gateway Abroad Educations</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-rose-50 sm:text-base">{intro}</p>
            </div>
          </div>
        </header>

        <div className="mt-6 rounded-xl border border-[#eee5e6] bg-white px-5 py-4 text-sm text-[#62616a] shadow-sm sm:px-7">
          <span className="font-semibold text-[#34313a]">Last updated:</span> {updated || "November 3, 2026"}
        </div>

        <article className="mt-5 rounded-xl border border-[#eee5e6] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-9">
          <div className="divide-y divide-[#f0ebec]">
            {sections.map((section, index) => (
              <section key={section.title} className="py-6 first:pt-0 last:pb-0">
                <h2 className="flex items-baseline gap-3 text-lg font-semibold text-[#292730] sm:text-xl"><span className="text-sm font-semibold text-[#c1243d]">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 max-w-4xl text-sm leading-7 text-[#56545d] sm:text-[15px]">{paragraph}</p>)}
                {section.bullets && <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#56545d] sm:text-[15px]">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
          </div>
          <div className="mt-8 rounded-lg bg-[#fbf4f5] px-5 py-4 text-sm leading-6 text-[#56545d]">
            For questions, contact <a className="font-medium text-[#a51d34] underline underline-offset-2" href="mailto:jaipur@gatewayabroad.in">jaipur@gatewayabroad.in</a> or call <a className="font-medium text-[#a51d34] underline underline-offset-2" href="tel:+919166144321">+91 91661 44321</a>. You can also review our <Link className="font-medium text-[#a51d34] underline underline-offset-2" href="/privacy-policy">Privacy Policy</Link>, <Link className="font-medium text-[#a51d34] underline underline-offset-2" href="/cookie-policy">Cookie Policy</Link>, <Link className="font-medium text-[#a51d34] underline underline-offset-2" href="/terms">Terms and Conditions</Link>, and <Link className="font-medium text-[#a51d34] underline underline-offset-2" href="/content-policy">Content Policy</Link>.
          </div>
        </article>
      </div>
    </main>
  );
}
