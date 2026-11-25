import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/lib/registry";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const cats = Object.keys(CATEGORIES) as ToolCategory[];
  return (
    <div className="mx-auto max-w-5xl px-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
        }}
      />
      <section className="py-14 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">Free · No login · Private</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Running calculators that just work.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Pace, race predictions, VDOT training paces, heart rate zones, marathon splits and race-day fueling.
          Instant results, in your browser, in km or miles.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tools/pace-calculator"
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-brand-fg hover:opacity-90"
          >
            Open the pace calculator
          </Link>
          <Link href="#tools" className="rounded-lg border border-line px-5 py-3 font-semibold hover:bg-surface">
            Browse all tools
          </Link>
        </div>
      </section>

      <section id="tools" className="scroll-mt-20 space-y-12 pb-8">
        {cats.map((c) => (
          <div key={c}>
            <h2 className="text-xl font-bold">{CATEGORIES[c].label}</h2>
            <p className="mt-1 text-sm text-muted">{CATEGORIES[c].description}</p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {TOOLS.filter((t) => t.category === c).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="group flex h-full gap-4 rounded-xl border border-line bg-surface p-5 transition hover:border-brand"
                  >
                    <span aria-hidden className="text-2xl">
                      {t.emoji}
                    </span>
                    <span>
                      <span className="block font-semibold group-hover:text-brand">{t.name}</span>
                      <span className="mt-1 block text-sm text-muted">{t.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
