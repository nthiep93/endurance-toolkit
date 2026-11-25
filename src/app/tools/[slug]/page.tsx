import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { CATEGORIES, TOOLS, getTool } from "@/lib/registry";
import { getGuide } from "@/content/guides";
import { ToolRenderer } from "@/components/tools";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const url = `/tools/${tool.slug}`;
  return {
    title: { absolute: tool.seoTitle },
    description: tool.seoDescription,
    keywords: [tool.primaryKeyword, ...tool.secondaryKeywords],
    alternates: { canonical: url },
    openGraph: { title: tool.seoTitle, description: tool.seoDescription, url, type: "website" },
  };
}

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const guide = getGuide(slug);
  const related = tool.related.map(getTool).filter((t) => t !== undefined);
  const pageUrl = `${SITE.url}/tools/${tool.slug}`;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url: pageUrl,
      description: tool.seoDescription,
      applicationCategory: "SportsApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: CATEGORIES[tool.category].label, item: `${SITE.url}/#tools` },
        { "@type": "ListItem", position: 3, name: tool.name, item: pageUrl },
      ],
    },
  ];
  if (guide?.faqs.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  if (guide?.howTo.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to use the ${tool.name}`,
      step: guide.howTo.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
    });
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="no-print text-sm text-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
        <span aria-hidden> / </span>
        <Link href="/#tools" className="hover:text-fg">{CATEGORIES[tool.category].label}</Link>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span aria-hidden className="mr-2">{tool.emoji}</span>
        {tool.name}
      </h1>
      <p className="no-print mt-3 text-lg text-muted">{guide?.intro ?? tool.summary}</p>

      <section aria-label="Calculator" className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6">
        <ToolRenderer slug={tool.slug} />
      </section>

      <div className="mt-6">
        <AdSlot id={`${tool.slug}-sponsor`} variant="sponsor" />
      </div>

      {guide && (
        <div className="prose-guide no-print mt-10">
          {guide.howTo.length > 0 && (
            <>
              <h2>How to use this calculator</h2>
              <ol className="mb-4 list-decimal space-y-1 pl-5">
                {guide.howTo.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </>
          )}
          {guide.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto">
                  <table className="tabular">
                    <thead>
                      <tr>{s.table.headers.map((h) => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((r, j) => (
                        <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {i === 1 && <AdSlot id={`${tool.slug}-incontent`} />}
            </section>
          ))}

          {guide.faqs.length > 0 && (
            <section>
              <h2>Frequently asked questions</h2>
              <div className="space-y-3">
                {guide.faqs.map((f, i) => (
                  <details key={i} className="rounded-lg border border-line bg-surface p-4">
                    <summary className="cursor-pointer font-semibold">{f.q}</summary>
                    <p className="mt-2 mb-0 text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          <p className="mt-6 text-xs text-muted">Last reviewed: {guide.updated}</p>
        </div>
      )}

      {related.length > 0 && (
        <aside className="no-print mt-12">
          <h2 className="text-lg font-bold">Related tools</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/tools/${r.slug}`}
                  className="flex gap-3 rounded-xl border border-line bg-surface p-4 hover:border-brand"
                >
                  <span aria-hidden>{r.emoji}</span>
                  <span>
                    <span className="block font-semibold">{r.name}</span>
                    <span className="block text-sm text-muted">{r.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
