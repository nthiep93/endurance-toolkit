/**
 * Goal-pace pages: data + build-time computation.
 * Every number shown on /pace/<slug> comes from computeGoal(), which only calls "@/lib/calc".
 * Kept deliberately small (see docs/STRATEGY.md §3, programmatic-page caveat): add goals only
 * when Search Console shows demand for the existing ones.
 */
import {
  KM_PER_MILE,
  RACE_DISTANCES,
  formatDuration,
  formatPace,
  fuelingPlan,
  pacePerKmToPerMile,
  raceTimeFromVdot,
  riegelPredict,
  solvePace,
  splitPlan,
  trainingPaces,
  vdotFromRace,
  type FuelingPlan,
  type TrainingPaces,
} from "./calc";

export type GoalDistanceId = "marathon" | "half" | "10k" | "5k";

export interface GoalDistance {
  id: GoalDistanceId;
  label: string; // "Half Marathon"
  lower: string; // "half marathon"
  slugPart: string; // "half-marathon"
  km: number;
}

export const GOAL_DISTANCES: GoalDistance[] = [
  { id: "marathon", label: "Marathon", lower: "marathon", slugPart: "marathon", km: 42.195 },
  { id: "half", label: "Half Marathon", lower: "half marathon", slugPart: "half-marathon", km: 21.0975 },
  { id: "10k", label: "10K", lower: "10K", slugPart: "10k", km: 10 },
  { id: "5k", label: "5K", lower: "5K", slugPart: "5k", km: 5 },
];

export interface Goal {
  slug: string;
  distance: GoalDistance;
  targetSec: number;
  /** "Sub-3:15" */
  label: string;
  /** "Sub-3:15 Marathon" */
  name: string;
  /** "sub-3:15 marathon" — for use mid-sentence */
  phrase: string;
}

/** [distance, minutes] pairs. Order within a distance = fastest first. */
const RAW: [GoalDistanceId, number][] = [
  ["marathon", 180],
  ["marathon", 195],
  ["marathon", 210],
  ["marathon", 225],
  ["marathon", 240],
  ["marathon", 270],
  ["marathon", 300],
  ["half", 90],
  ["half", 105],
  ["half", 120],
  ["half", 135],
  ["10k", 40],
  ["10k", 45],
  ["10k", 50],
  ["10k", 60],
  ["5k", 20],
  ["5k", 25],
  ["5k", 30],
];

function timeLabel(min: number, distanceId: GoalDistanceId): string {
  // Marathon/half goals are spoken in hours ("sub-3:15", "sub-2"); 5K/10K in minutes ("sub-40").
  if (distanceId === "5k" || distanceId === "10k") return String(min);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? String(h) : `${h}:${String(m).padStart(2, "0")}`;
}

export const GOALS: Goal[] = RAW.map(([id, min]) => {
  const distance = GOAL_DISTANCES.find((d) => d.id === id)!;
  const t = timeLabel(min, id);
  const label = `Sub-${t}`;
  return {
    slug: `sub-${t.replace(":", "-")}-${distance.slugPart}-pace`,
    distance,
    targetSec: min * 60,
    label,
    name: `${label} ${distance.label}`,
    phrase: `sub-${t} ${distance.lower}`,
  };
});

export function getGoal(slug: string): Goal | undefined {
  return GOALS.find((g) => g.slug === slug);
}

export function goalsForDistance(id: GoalDistanceId): Goal[] {
  return GOALS.filter((g) => g.distance.id === id).sort((a, b) => a.targetSec - b.targetSec);
}

/** Faster = next-faster goal at the same distance; slower = next-slower. */
export function neighbours(goal: Goal): { faster?: Goal; slower?: Goal } {
  const list = goalsForDistance(goal.distance.id);
  const i = list.findIndex((g) => g.slug === goal.slug);
  return { faster: list[i - 1], slower: list[i + 1] };
}

// ---------------------------------------------------------------------------------------------
// formatting helpers

/** Pace for a "sub-X" goal: truncate to the whole second so the shown pace is never slower than needed. */
export function goalPace(secPerUnit: number): string {
  return formatPace(Math.floor(secPerUnit + 1e-9));
}
export const pace = (secPerKm: number) => formatPace(secPerKm);
export const paceMile = (secPerKm: number) => formatPace(pacePerKmToPerMile(secPerKm));
export const time = (sec: number) => formatDuration(sec);
const fix1 = (n: number) => n.toFixed(1);

function signedGap(sec: number): string {
  const s = Math.round(Math.abs(sec));
  return s < 60 ? `${s} s` : formatDuration(s);
}

// ---------------------------------------------------------------------------------------------
// computation

export interface Checkpoint {
  label: string;
  km: number;
  evenSec: number;
  negSec: number;
  /** pace of the split ending here (negative-split plan) */
  negPaceSecPerKm: number;
  isHalfway?: boolean;
}

export interface Equivalent {
  id: string;
  label: string;
  km: number;
  sec: number;
  paceSecPerKm: number;
}

export interface CoveredGoal {
  distance: GoalDistance;
  /** fastest listed goal the equivalent time beats */
  goal?: Goal;
  equivalentSec: number;
  /** seconds to spare vs that goal (positive) */
  marginSec?: number;
}

export interface GoalData {
  goal: Goal;
  paceSecPerKm: number;
  paceSecPerMile: number;
  speedKmh: number;
  speedMph: number;
  /** finish time if you hold the displayed (truncated) km pace exactly */
  finishAtShownPaceSec: number;
  vdot: number;
  /** km checkpoints: every 5 km (+ halfway) for half/marathon, every km for 5K/10K, always incl. finish */
  kmCheckpoints: Checkpoint[];
  mileCheckpoints: Checkpoint[];
  /** every-km cumulative even-pace times for the pace band */
  bandKm: { label: string; sec: number }[];
  bandMile: { label: string; sec: number }[];
  negPct: number;
  halfwayEvenSec: number;
  halfwayNegSec: number;
  firstHalfPace: number;
  secondHalfPace: number;
  equivalents: Equivalent[];
  training: TrainingPaces;
  fueling: FuelingPlan | null;
  covered: CoveredGoal[];
  realism: string[];
  faqs: { q: string; a: string }[];
}

const NEG_PCT = 2;

/** Distances used for "what you should be able to run first" (skip 1K/50K: outside or at the edge of the model). */
const EQUIV_IDS = ["1mile", "5k", "10k", "10mile", "half", "marathon"];

/** Which equivalent races are the natural fitness check for each goal distance. */
const CHECK_RACES: Record<GoalDistanceId, [string, string]> = {
  marathon: ["half", "10k"],
  half: ["10k", "5k"],
  "10k": ["5k", "half"],
  "5k": ["1mile", "10k"],
};

function checkpointsFromSplits(
  distanceKm: number,
  targetSec: number,
  unit: "km" | "mile",
): { even: NonNullable<ReturnType<typeof splitPlan>>; neg: NonNullable<ReturnType<typeof splitPlan>> } {
  const even = splitPlan({ distanceKm, targetSec, unit, strategy: "even" });
  const neg = splitPlan({ distanceKm, targetSec, unit, strategy: "negative", negativePct: NEG_PCT });
  if (!even || !neg) throw new Error(`splitPlan failed for ${distanceKm} km / ${targetSec} s`);
  return { even, neg };
}

export function computeGoal(goal: Goal): GoalData {
  const D = goal.distance.km;
  const T = goal.targetSec;
  const sol = solvePace({ distanceKm: D, timeSec: T });
  const vdot = vdotFromRace(D, T);
  const training = vdot === null ? null : trainingPaces(vdot);
  if (!sol || vdot === null || !training) throw new Error(`calc failed for ${goal.slug}`);

  const shownPace = Math.floor(sol.paceSecPerKm + 1e-9);
  const finishAtShownPaceSec = shownPace * D;

  // --- km checkpoints
  const km = checkpointsFromSplits(D, T, "km");
  const longRace = D > 20;
  const kmCheckpoints: Checkpoint[] = [];
  const firstHalfPace = km.neg[0].paceSecPerKm;
  const secondHalfPace = km.neg[km.neg.length - 1].paceSecPerKm;
  const halfwayEvenSec = T / 2;
  const halfwayNegSec = firstHalfPace * (D / 2);
  km.even.forEach((row, i) => {
    const end = row.index === km.even.length ? D : row.index; // km index == cumulative km for full splits
    const isLast = i === km.even.length - 1;
    if (longRace && !isLast && end % 5 !== 0) return;
    // insert halfway before the first checkpoint beyond it (long races only)
    if (longRace && end > D / 2 && !kmCheckpoints.some((c) => c.isHalfway)) {
      kmCheckpoints.push({
        label: `Halfway (${fix1(D / 2)} km)`,
        km: D / 2,
        evenSec: halfwayEvenSec,
        negSec: halfwayNegSec,
        negPaceSecPerKm: firstHalfPace,
        isHalfway: true,
      });
    }
    kmCheckpoints.push({
      label: isLast ? `Finish (${row.label})` : row.label,
      km: end,
      evenSec: row.cumulativeSec,
      negSec: km.neg[i].cumulativeSec,
      negPaceSecPerKm: km.neg[i].paceSecPerKm,
    });
  });

  // --- mile markers
  const mi = checkpointsFromSplits(D, T, "mile");
  const mileCheckpoints: Checkpoint[] = mi.even.map((row, i) => ({
    label: i === mi.even.length - 1 ? `Finish (${row.label})` : `Mile ${row.index}`,
    km: Math.min(row.index * KM_PER_MILE, D),
    evenSec: row.cumulativeSec,
    negSec: mi.neg[i].cumulativeSec,
    negPaceSecPerKm: mi.neg[i].paceSecPerKm,
  }));

  const bandKm = km.even.map((r, i) => ({
    label: i === km.even.length - 1 ? fix1(D).replace(/\.0$/, "") : String(r.index),
    sec: r.cumulativeSec,
  }));
  const bandMile = mi.even.map((r, i) => ({
    label: i === mi.even.length - 1 ? (D / KM_PER_MILE).toFixed(1) : String(r.index),
    sec: r.cumulativeSec,
  }));

  // --- equivalents
  const equivalents: Equivalent[] = [];
  for (const id of EQUIV_IDS) {
    const rd = RACE_DISTANCES.find((r) => r.id === id);
    if (!rd || Math.abs(rd.km - D) < 1e-6) continue;
    const sec = raceTimeFromVdot(vdot, rd.km);
    if (sec === null) continue;
    equivalents.push({ id, label: rd.label, km: rd.km, sec, paceSecPerKm: sec / rd.km });
  }

  // --- other listed goals this fitness covers
  const covered: CoveredGoal[] = [];
  for (const d of GOAL_DISTANCES) {
    if (d.id === goal.distance.id) continue;
    const eq = raceTimeFromVdot(vdot, d.km);
    if (eq === null) continue;
    const beaten = goalsForDistance(d.id).find((g) => eq < g.targetSec);
    covered.push({ distance: d, goal: beaten, equivalentSec: eq, marginSec: beaten ? beaten.targetSec - eq : undefined });
  }

  const fueling = D > 20 ? fuelingPlan({ durationSec: T }) : null;

  const data: GoalData = {
    goal,
    paceSecPerKm: sol.paceSecPerKm,
    paceSecPerMile: sol.paceSecPerMile,
    speedKmh: sol.speedKmh,
    speedMph: sol.speedMph,
    finishAtShownPaceSec,
    vdot,
    kmCheckpoints,
    mileCheckpoints,
    bandKm,
    bandMile,
    negPct: NEG_PCT,
    halfwayEvenSec,
    halfwayNegSec,
    firstHalfPace,
    secondHalfPace,
    equivalents,
    training,
    fueling,
    covered,
    realism: [],
    faqs: [],
  };
  data.realism = realismText(data);
  data.faqs = faqText(data);
  return data;
}

// ---------------------------------------------------------------------------------------------
// deterministic text (numbers only — no generic filler)

export function headline(d: GoalData): string {
  const g = d.goal;
  return `To run a ${g.phrase} (${time(g.targetSec)} for ${Number(g.distance.km.toFixed(4))} km) you need to average ${goalPace(d.paceSecPerKm)} per km (${goalPace(d.paceSecPerMile)} per mile) or faster — ${d.speedKmh.toFixed(1)} km/h or ${d.speedMph.toFixed(1)} mph.`;
}

export function shownPaceNote(d: GoalData): string {
  const g = d.goal;
  const shown = goalPace(d.paceSecPerKm);
  const spare = g.targetSec - d.finishAtShownPaceSec;
  if (Math.round(spare) <= 0) {
    return `${shown}/km is exactly ${time(g.targetSec)} pace, so to go under you need to be a touch quicker than that on average.`;
  }
  return `Holding exactly ${shown}/km gets you to the line in ${time(d.finishAtShownPaceSec)}, ${signedGap(spare)} inside the goal — a small buffer for GPS drift and crowded corners.`;
}

const EQ_NAMES: Record<string, string> = {
  "1mile": "mile",
  "5k": "5K",
  "10k": "10K",
  "10mile": "10-mile",
  half: "half marathon",
  marathon: "marathon",
};
const eqName = (e: Equivalent) => EQ_NAMES[e.id] ?? e.label;

function eq(d: GoalData, id: string): Equivalent | undefined {
  return d.equivalents.find((e) => e.id === id);
}

function realismText(d: GoalData): string[] {
  const g = d.goal;
  const out: string[] = [];
  const [c1, c2] = CHECK_RACES[g.distance.id].map((id) => eq(d, id));

  if (c1 && c2) {
    out.push(
      `A ${g.phrase} corresponds to a VDOT of about ${fix1(d.vdot)}. On the Daniels–Gilbert equivalence model that fitness also produces a ${eqName(c1)} of ${time(c1.sec)} (${pace(c1.paceSecPerKm)}/km) and a ${eqName(c2)} of ${time(c2.sec)} (${pace(c2.paceSecPerKm)}/km). A recent race at or under those times says the goal is in line with your current fitness; a slower one tells you roughly how much fitness you still need to find.`,
    );
  }

  // Ratio check + Riegel cross-check from the primary check race.
  if (c1) {
    const ratio = g.targetSec / c1.sec;
    const riegel = riegelPredict(c1.sec, c1.km, g.distance.km);
    const goalIsLonger = g.distance.km > c1.km;
    let s = goalIsLonger
      ? `At this level the model puts your ${g.distance.lower} time at ${ratio.toFixed(3)}× your ${eqName(c1)} time.`
      : `At this level the model puts your ${g.distance.lower} time at ${ratio.toFixed(3)}× your ${eqName(c1)} time (${(1 / ratio).toFixed(3)}× the other way).`;
    if (riegel !== null) {
      const diff = riegel - g.targetSec;
      s += ` Riegel's formula (exponent 1.06) applied to the same ${time(c1.sec)} predicts ${time(riegel)}, ${signedGap(diff)} ${diff > 0 ? "slower" : "faster"} than the goal`;
      s +=
        g.distance.id === "marathon"
          ? diff > 0
            ? ` — the more conservative of the two, and the marathon is where equivalence tables are most often optimistic if long-run volume is low.`
            : `.`
          : `.`;
    }
    out.push(s);
  }

  // Neighbour step
  const { faster, slower } = neighbours(g);
  if (slower) {
    const sv = vdotFromRace(slower.distance.km, slower.targetSec);
    const dp = slower.targetSec / g.distance.km - d.paceSecPerKm;
    if (sv !== null) {
      out.push(
        `Stepping up from a ${slower.phrase} means running ${Math.round(dp)} s/km faster for the whole race (${((1 - g.targetSec / slower.targetSec) * 100).toFixed(1)}% less time) and needs about ${fix1(d.vdot - sv)} more VDOT points.`,
      );
    }
  } else if (faster) {
    out.push(
      `This is the slowest ${g.distance.lower} goal listed here; the next step, a ${faster.phrase}, needs ${Math.round(d.paceSecPerKm - faster.targetSec / g.distance.km)} s/km faster pace.`,
    );
  }

  // Coverage of other goals
  const parts = d.covered.map((c) =>
    c.goal
      ? `${c.goal.phrase} (equivalent ${time(c.equivalentSec)}, ${signedGap(c.marginSec ?? 0)} to spare)`
      : `none of the ${c.distance.lower} goals listed (equivalent ${time(c.equivalentSec)})`,
  );
  if (parts.length) out.push(`On paper, the same fitness is enough for: ${parts.join("; ")}.`);
  return out;
}

function faqText(d: GoalData): { q: string; a: string }[] {
  const g = d.goal;
  const faqs = [
    {
      q: `What pace is a ${g.phrase}?`,
      a: `${goalPace(d.paceSecPerKm)} per km or ${goalPace(d.paceSecPerMile)} per mile (${d.speedKmh.toFixed(1)} km/h). ${shownPaceNote(d)}`,
    },
    {
      q: `What is the halfway split for a ${g.phrase}?`,
      a: `${time(d.halfwayEvenSec)} at ${Number((g.distance.km / 2).toFixed(1))} km if you run even pace. With a ${d.negPct}% negative split, reach halfway in ${time(d.halfwayNegSec)} (${pace(d.firstHalfPace)}/km) and run the second half at ${pace(d.secondHalfPace)}/km.`,
    },
  ];
  const [c1, c2] = CHECK_RACES[g.distance.id].map((id) => eq(d, id));
  if (c1 && c2) {
    faqs.push({
      q: `What ${eqName(c1)} time do I need for a ${g.phrase}?`,
      a: `About ${time(c1.sec)} or faster, and a ${eqName(c2)} of about ${time(c2.sec)}. Both are equivalent performances to ${time(g.targetSec)} at VDOT ${fix1(d.vdot)} on the Daniels–Gilbert model.`,
    });
  }
  return faqs;
}

export function seoTitle(d: GoalData): string {
  return `${d.goal.name} Pace: ${goalPace(d.paceSecPerKm)}/km (${goalPace(d.paceSecPerMile)}/mile) Pace Chart & Splits`;
}

export function seoDescription(d: GoalData): string {
  const g = d.goal;
  const step = d.goal.distance.km > 20 ? "5 km" : "1 km";
  return `${g.name} pace is ${goalPace(d.paceSecPerKm)}/km (${goalPace(d.paceSecPerMile)}/mile). ${step} and mile splits, ${d.negPct}% negative-split plan, printable pace band, VDOT ${fix1(d.vdot)} training paces and equivalent race times.`;
}
