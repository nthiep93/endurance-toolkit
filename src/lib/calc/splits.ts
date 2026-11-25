import { KM_PER_MILE } from "./units";
import { isPos } from "./_util";

export interface SplitRow {
  index: number; // 1-based
  label: string; // cumulative distance at the end of the split, e.g. "5 km", "26.22 mi"
  distanceKm: number; // length of this split
  splitSec: number; // unrounded seconds
  paceSecPerKm: number;
  cumulativeSec: number;
}

const MAX_SPLITS = 1000;

function overlap(a: number, b: number, lo: number, hi: number): number {
  return Math.max(0, Math.min(b, hi) - Math.max(a, lo));
}

function fmtNum(n: number, decimals: number): string {
  return String(Number(n.toFixed(decimals)));
}

/** unit = size of each split ("km" or "mile"); last split may be partial.
 *  strategy "even" or "negative": first half (by distance) slower by negativePct/2 %, second half
 *  faster by negativePct/2 %, total == targetSec. negativePct default 2, accepted 0..20.
 *  A split straddling halfway gets a distance-weighted mix of both paces. */
export function splitPlan(input: {
  distanceKm: number;
  targetSec: number;
  unit: "km" | "mile";
  strategy: "even" | "negative";
  negativePct?: number;
}): SplitRow[] | null {
  if (!input || typeof input !== "object") return null;
  const { distanceKm, targetSec, unit, strategy } = input;
  if (!isPos(distanceKm) || !isPos(targetSec)) return null;
  if (unit !== "km" && unit !== "mile") return null;
  if (strategy !== "even" && strategy !== "negative") return null;
  const negPct = input.negativePct ?? 2;
  if (typeof negPct !== "number" || !Number.isFinite(negPct) || negPct < 0 || negPct > 20) return null;

  const size = unit === "km" ? 1 : KM_PER_MILE;
  const ratio = distanceKm / size;
  let full = Math.floor(ratio + 1e-9);
  let remainder = distanceKm - full * size;
  if (remainder < 1e-6) remainder = 0;
  if (full * size > distanceKm) full = Math.floor(ratio); // guard against epsilon overshoot
  const count = full + (remainder > 0 ? 1 : 0);
  if (count < 1 || count > MAX_SPLITS) return null;

  const avg = targetSec / distanceKm;
  const q = strategy === "negative" ? negPct / 200 : 0;
  const slow = avg * (1 + q);
  const fast = avg * (1 - q);
  const half = distanceKm / 2;

  const rows: SplitRow[] = [];
  let cum = 0;
  for (let i = 0; i < count; i++) {
    const a = i * size;
    const b = i < full ? (i + 1) * size : distanceKm;
    const len = b - a;
    const splitSec = slow * overlap(a, b, 0, half) + fast * overlap(a, b, half, distanceKm);
    cum += splitSec;
    const label = unit === "km" ? `${fmtNum(b, 3)} km` : `${fmtNum(b / KM_PER_MILE, 2)} mi`;
    rows.push({ index: i + 1, label, distanceKm: len, splitSec, paceSecPerKm: splitSec / len, cumulativeSec: cum });
  }
  return rows;
}
