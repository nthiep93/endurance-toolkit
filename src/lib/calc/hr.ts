import { isPos } from "./_util";

export type MaxHrFormula = "fox" | "tanaka" | "gellish"; // 220-age | 208-0.7age | 207-0.7age

/** Age must be within 1..120. Result rounded to whole bpm. */
export function estimateMaxHr(age: number, formula: MaxHrFormula = "tanaka"): number | null {
  if (!isPos(age) || age < 1 || age > 120) return null;
  let v: number;
  switch (formula) {
    case "fox":
      v = 220 - age;
      break;
    case "tanaka":
      v = 208 - 0.7 * age;
      break;
    case "gellish":
      v = 207 - 0.7 * age;
      break;
    default:
      return null;
  }
  return isPos(v) ? Math.round(v) : null;
}

export interface HrZone {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;
  minBpm: number;
  maxBpm: number;
  minPct: number;
  maxPct: number;
  purpose: string;
}

const ZONES: { zone: 1 | 2 | 3 | 4 | 5; name: string; minPct: number; maxPct: number; purpose: string }[] = [
  { zone: 1, name: "Recovery", minPct: 50, maxPct: 60, purpose: "Active recovery, warm-up and cool-down" },
  { zone: 2, name: "Endurance (aerobic)", minPct: 60, maxPct: 70, purpose: "Aerobic base, fat oxidation, easy and long runs" },
  { zone: 3, name: "Tempo", minPct: 70, maxPct: 80, purpose: "Aerobic power, steady and marathon-pace running" },
  { zone: 4, name: "Threshold", minPct: 80, maxPct: 90, purpose: "Lactate threshold, sustained hard efforts" },
  { zone: 5, name: "VO2max", minPct: 90, maxPct: 100, purpose: "Maximal aerobic capacity, short intervals" },
];

function buildZones(maxHr: number, restHr: number): HrZone[] {
  // Each boundary is computed once, so zone N's maxBpm === zone N+1's minBpm (contiguous).
  const bpm = (pct: number) => Math.round(restHr + (pct / 100) * (maxHr - restHr));
  return ZONES.map((z) => ({ ...z, minBpm: bpm(z.minPct), maxBpm: bpm(z.maxPct) }));
}

/** Karvonen: target = rest + pct*(max-rest). Zones 50-60,60-70,70-80,80-90,90-100 %.
 *  Requires 0 < restHr < maxHr <= 260. */
export function karvonenZones(maxHr: number, restHr: number): HrZone[] | null {
  if (!isPos(maxHr) || !isPos(restHr) || maxHr > 260 || restHr >= maxHr) return null;
  return buildZones(maxHr, restHr);
}

/** % of max HR, same pct bands. Requires 0 < maxHr <= 260. */
export function percentMaxZones(maxHr: number): HrZone[] | null {
  if (!isPos(maxHr) || maxHr > 260) return null;
  return buildZones(maxHr, 0);
}
