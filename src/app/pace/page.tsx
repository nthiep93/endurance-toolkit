import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { GOAL_DISTANCES, computeGoal, goalPace, goalsForDistance, time } from "@/lib/goals";
import { JsonLd } from "@/components/JsonLd";

const TITLE = "Goal Race Pace Chart: Marathon, Half Marathon, 10K & 5K Target Paces";
const DESCRIPTION =
  "Required pace per km and per mile for popular goal times — sub-3 to sub-5 marathon, sub-1:30 to sub-2:15 half, sub-40 to sub-60 10K and sub-20 to sub-30 5K — with splits for each.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/pace" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/pace", type: "website" },
};

export default function PaceHub() {
  const groups = GOAL_DISTANCES.map((dist) => ({
    dist,
    rows: goalsForDistance(dist.id).map((g) => computeGoal(g)),
  }));

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Goal paces", item: `${SITE.url}/pace` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: groups
              .flatMap((g) => g.rows)
              .map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${r.goal.name} pace`,
                url: `${SITE.url}/pace/${r.goal.slug}`,
              })),
          },
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
      </nav>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Goal race paces</h1>
      <p className="mt-3 text-lg text-muted">
        The average pace each goal time needs, per km and per mile. Open a goal for its split chart, mile markers,
        negative-split plan, printable pace band, training paces and equivalent race times.
      </p>

      <div className="prose-guide mt-8">
        {groups.map(({ dist, rows }) => (
          <section key={dist.id}>
            <h2>{dist.label} goal paces</h2>
            <div className="overflow-x-auto">
              <table className="tabular">
                <thead>
                  <tr>
                    <th>Goal</th>
                    <th>Time</th>
                    <th>Pace /km</th>
                    <th>Pace /mile</th>
                    <th>VDOT</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.goal.slug}>
                      <td>
                        <Link href={`/pace/${r.goal.slug}`} className="font-semibold text-brand hover:underline">
                          {r.goal.name}
                        </Link>
                      </td>
                      <td>{time(r.goal.targetSec)}</td>
                      <td>{goalPace(r.paceSecPerKm)}</td>
                      <td>{goalPace(r.paceSecPerMile)}</td>
                      <td>{r.vdot.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <p className="text-sm text-muted">
          Paces are truncated to the whole second, so holding the listed pace always lands you inside the goal or exactly
          on it. Need a different time? Use the <Link href="/tools/pace-calculator">pace calculator</Link> or the{" "}
          <Link href="/tools/marathon-splits">split calculator</Link>.
        </p>
      </div>
    </article>
  );
}
