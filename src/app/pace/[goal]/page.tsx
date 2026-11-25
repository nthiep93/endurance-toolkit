import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import {
  GOALS,
  computeGoal,
  getGoal,
  goalPace,
  headline,
  neighbours,
  pace,
  paceMile,
  seoDescription,
  seoTitle,
  shownPaceNote,
  time,
  type Checkpoint,
} from "@/lib/goals";
import { JsonLd } from "@/components/JsonLd";
import { Card, ResultStat, ResultTable, StatGrid, type Column } from "@/components/ui";
import { PrintButton } from "@/components/goals/PrintButton";

export function generateStaticParams() {
  return GOALS.map((g) => ({ goal: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/pace/[goal]">): Promise<Metadata> {
  const { goal: slug } = await params;
  const goal = getGoal(slug);
  if (!goal) return {};
  const d = computeGoal(goal);
  const url = `/pace/${goal.slug}`;
  const title = seoTitle(d);
  const description = seoDescription(d);
  return {
    title: { absolute: title },
    description,
    keywords: [`${goal.phrase} pace`, `${goal.phrase} splits`, `${goal.phrase} pace chart`],
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

const checkpointColumns = (unitLabel: string, negPct: number): Column<Checkpoint>[] => [
  { key: "l", header: unitLabel, cell: (r) => r.label, rowHeader: true },
  { key: "e", header: "Even pace", cell: (r) => time(r.evenSec), align: "right" },
  { key: "n", header: `${negPct}% negative`, cell: (r) => time(r.negSec), align: "right" },
  { key: "p", header: "Neg. split pace /km", cell: (r) => pace(r.negPaceSecPerKm), align: "right" },
];

const TRAINING_ROWS = [
  { key: "easy", name: "Easy (E)", use: "Most weekly mileage, long runs" },
  { key: "marathon", name: "Marathon (M)", use: "Steady long-run segments" },
  { key: "threshold", name: "Threshold (T)", use: "Tempo runs, cruise intervals" },
  { key: "interval", name: "Interval (I)", use: "3–5 min repeats" },
  { key: "repetition", name: "Repetition (R)", use: "200–400 m repeats, full recovery" },
] as const;

export default async function GoalPacePage({ params }: PageProps<"/pace/[goal]">) {
  const { goal: slug } = await params;
  const goal = getGoal(slug);
  if (!goal) notFound();
  const d = computeGoal(goal);
  const { faster, slower } = neighbours(goal);
  const pageUrl = `${SITE.url}/pace/${goal.slug}`;
  const longRace = goal.distance.km > 20;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
        { "@type": "ListItem", position: 2, name: "Goal paces", item: `${SITE.url}/pace` },
        { "@type": "ListItem", position: 3, name: `${goal.name} pace`, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const tp = d.training;
  const tRange = (r: { minSecPerKm: number; maxSecPerKm: number }, perMile: boolean) => {
    const f = perMile ? paceMile : pace;
    const a = f(r.minSecPerKm);
    const b = f(r.maxSecPerKm);
    return a === b ? a : `${a}–${b}`;
  };
  const goalVsT = d.paceSecPerKm - tp.threshold.maxSecPerKm;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="no-print text-sm text-muted">
        <Link href="/" className="hover:text-fg">Home</Link>
        <span aria-hidden> / </span>
        <Link href="/pace" className="hover:text-fg">Goal paces</Link>
      </nav>

      <h1 className="no-print mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{goal.name} Pace</h1>
      <p className="no-print mt-3 text-lg">{headline(d)}</p>
      <p className="no-print mt-2 text-muted">{shownPaceNote(d)}</p>

      <StatGrid cols={4} className="no-print mt-6">
        <ResultStat label="Pace per km" value={goalPace(d.paceSecPerKm)} sub="min/km" emphasis />
        <ResultStat label="Pace per mile" value={goalPace(d.paceSecPerMile)} sub="min/mile" />
        <ResultStat label="Halfway (even)" value={time(d.halfwayEvenSec)} sub={`at ${Number((goal.distance.km / 2).toFixed(1))} km`} />
        <ResultStat label="VDOT needed" value={d.vdot.toFixed(1)} sub="Daniels–Gilbert" />
      </StatGrid>

      <div className="prose-guide no-print mt-10">
        <h2>{goal.name} split chart</h2>
        <p>
          Cumulative times {longRace ? "every 5 km" : "at every kilometre"} for an even-paced {time(goal.targetSec)}, next
          to a {d.negPct}% negative split ({pace(d.firstHalfPace)}/km for the first half, {pace(d.secondHalfPace)}/km for
          the second).
        </p>
      </div>
      <ResultTable
        className="no-print"
        caption={`${goal.name} kilometre checkpoints`}
        dense
        rows={d.kmCheckpoints}
        rowKey={(r) => r.label}
        highlight={(r) => !!r.isHalfway}
        columns={checkpointColumns("Distance", d.negPct)}
      />

      <div className="prose-guide no-print mt-8">
        <h3 className="text-lg font-bold">Mile markers</h3>
      </div>
      <ResultTable
        className="no-print mt-3"
        caption={`${goal.name} mile markers`}
        dense
        rows={d.mileCheckpoints}
        rowKey={(r) => r.label}
        columns={checkpointColumns("Mile", d.negPct)}
      />

      <div className="prose-guide no-print mt-10">
        <h2>Even pace vs {d.negPct}% negative split</h2>
        <ul>
          <li>
            <strong>Even:</strong> {goalPace(d.paceSecPerKm)}/km throughout, halfway in {time(d.halfwayEvenSec)}.
          </li>
          <li>
            <strong>{d.negPct}% negative split:</strong> first half at {pace(d.firstHalfPace)}/km (
            {paceMile(d.firstHalfPace)}/mile), halfway in {time(d.halfwayNegSec)}; second half at {pace(d.secondHalfPace)}
            /km ({paceMile(d.secondHalfPace)}/mile), covering it in {time(goal.targetSec - d.halfwayNegSec)}.
          </li>
        </ul>
        <p>
          The negative-split plan banks nothing early: you pass halfway {time(d.halfwayNegSec - d.halfwayEvenSec)} behind
          even pace and need the faster second half to finish on {time(goal.targetSec)}.
        </p>
      </div>

      {/* Printable pace band: the only block without no-print. */}
      <Card
        className="mt-10 border-dashed"
        title={`${goal.name} pace band — ${time(goal.targetSec)} · ${goalPace(d.paceSecPerKm)}/km · ${goalPace(d.paceSecPerMile)}/mi`}
        actions={<PrintButton />}
      >
        <p className="no-print mb-3 text-sm text-muted">Even-pace cumulative times. Printing this page prints only this band.</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Kilometres</p>
        <ol className="tabular mt-1 grid grid-cols-4 gap-1 text-sm sm:grid-cols-6">
          {d.bandKm.map((b) => (
            <li key={b.label} className="rounded border border-line px-1.5 py-0.5">
              <span className="text-muted">{b.label}</span> {time(b.sec)}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Miles</p>
        <ol className="tabular mt-1 grid grid-cols-4 gap-1 text-sm sm:grid-cols-6">
          {d.bandMile.map((b) => (
            <li key={b.label} className="rounded border border-line px-1.5 py-0.5">
              <span className="text-muted">{b.label}</span> {time(b.sec)}
            </li>
          ))}
        </ol>
      </Card>

      <div className="prose-guide no-print mt-10">
        <h2>What you should be able to run first</h2>
        <p>
          A {time(goal.targetSec)} {goal.distance.lower} works out to VDOT {d.vdot.toFixed(1)}. These are the equivalent
          performances at that VDOT (raceTimeFromVdot); race one of them as a check before committing to the goal.
        </p>
        <div className="overflow-x-auto">
          <table className="tabular">
            <thead>
              <tr>
                <th>Distance</th>
                <th>Equivalent time</th>
                <th>Pace /km</th>
                <th>Pace /mile</th>
              </tr>
            </thead>
            <tbody>
              {d.equivalents.map((e) => (
                <tr key={e.id}>
                  <td>{e.label}</td>
                  <td>{time(e.sec)}</td>
                  <td>{pace(e.paceSecPerKm)}</td>
                  <td>{paceMile(e.paceSecPerKm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How realistic is a {goal.phrase}?</h2>
        {d.realism.map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        <h2>Training paces for VDOT {d.vdot.toFixed(1)}</h2>
        <p>
          Goal pace is {Math.abs(Math.round(goalVsT))} s/km {goalVsT >= 0 ? "slower" : "faster"} than the slow end of
          threshold pace at this fitness.
        </p>
        <div className="overflow-x-auto">
          <table className="tabular">
            <thead>
              <tr>
                <th>Pace</th>
                <th>Per km</th>
                <th>Per mile</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_ROWS.map((r) => (
                <tr key={r.key}>
                  <td>{r.name}</td>
                  <td>{tRange(tp[r.key], false)}</td>
                  <td>{tRange(tp[r.key], true)}</td>
                  <td>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {d.fueling && (
          <>
            <h2>Fueling for a {time(goal.targetSec)} {goal.distance.lower}</h2>
            {d.fueling.gels > 0 ? (
              <p>
                At {d.fueling.carbsPerHour} g of carbs per hour with 25 g gels, that is {d.fueling.gels} gels (
                {d.fueling.totalCarbsG} g) taken at {d.fueling.gelSchedule.map((m) => `${m}`).join(", ")} min, plus about{" "}
                {d.fueling.totalFluidMl} ml of fluid ({d.fueling.fluidMlPerHour} ml/h) and {d.fueling.sodiumMgPerHour} mg of
                sodium per hour. Practise this in long runs; adjust for heat and your own gut tolerance in the{" "}
                <Link href="/tools/race-fueling-calculator">race fueling calculator</Link>.
              </p>
            ) : (
              <p>Under an hour of running needs no gels; drink to thirst.</p>
            )}
          </>
        )}

        <h2>Frequently asked questions</h2>
        <div className="space-y-3">
          {d.faqs.map((f, i) => (
            <details key={i} className="rounded-lg border border-line bg-surface p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 mb-0 text-muted">{f.a}</p>
            </details>
          ))}
        </div>

        <h2>Plan it with the calculators</h2>
        <ul>
          <li>
            <Link href="/tools/marathon-splits">Split calculator</Link> — any distance, custom negative split, printable band.
          </li>
          <li>
            <Link href="/tools/pace-calculator">Pace calculator</Link> — solve pace, time or distance.
          </li>
          <li>
            <Link href="/tools/vdot-calculator">VDOT calculator</Link> — training paces from your own recent race.
          </li>
        </ul>
        <p className="mt-6 text-xs text-muted">
          Computed with the Endurance Toolkit calc library. Last reviewed: {SITE.lastUpdated}
        </p>
      </div>

      <nav aria-label="Neighbouring goals" className="no-print mt-10 grid gap-3 sm:grid-cols-2">
        {faster ? (
          <Link href={`/pace/${faster.slug}`} className="rounded-xl border border-line bg-surface p-4 hover:border-brand">
            <span className="block text-sm text-muted">Faster goal</span>
            <span className="block font-semibold">{faster.name} pace</span>
          </Link>
        ) : (
          <span />
        )}
        {slower && (
          <Link href={`/pace/${slower.slug}`} className="rounded-xl border border-line bg-surface p-4 text-right hover:border-brand">
            <span className="block text-sm text-muted">Slower goal</span>
            <span className="block font-semibold">{slower.name} pace</span>
          </Link>
        )}
      </nav>
      <p className="no-print mt-4 text-sm">
        <Link href="/pace" className="text-brand hover:underline">All goal paces →</Link>
      </p>
    </article>
  );
}
