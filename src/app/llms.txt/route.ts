import { SITE } from "@/lib/site";
import { CATEGORIES, TOOLS } from "@/lib/registry";

/** llms.txt — a plain-text map of the site for LLM crawlers (https://llmstxt.org). */
export function GET() {
  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "All calculators are free, need no account, and run entirely client-side.",
    "",
  ];
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    lines.push(`## ${cat.label}`, "");
    for (const t of TOOLS.filter((x) => x.category === key)) {
      lines.push(`- [${t.name}](${SITE.url}/tools/${t.slug}): ${t.seoDescription}`);
    }
    lines.push("");
  }
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
