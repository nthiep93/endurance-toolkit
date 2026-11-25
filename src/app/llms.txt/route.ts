import { SITE } from "@/lib/site";
import { CATEGORIES, TOOLS } from "@/lib/registry";
import { GOALS, computeGoal, goalPace } from "@/lib/goals";

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
  lines.push("## Goal paces", "", `- [Goal race paces](${SITE.url}/pace): required pace per km and mile for common marathon, half, 10K and 5K goals`);
  for (const g of GOALS) {
    const d = computeGoal(g);
    lines.push(
      `- [${g.name} pace](${SITE.url}/pace/${g.slug}): ${goalPace(d.paceSecPerKm)}/km (${goalPace(d.paceSecPerMile)}/mile); splits, pace band, VDOT ${d.vdot.toFixed(1)} training paces`,
    );
  }
  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
