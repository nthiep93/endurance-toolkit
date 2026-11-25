import { isPos } from "./_util";

/** Validity envelope of the Daniels–Gilbert equations (as used by vdotFromRace / raceTimeFromVdot). */
const MIN_KM = 1.5;
const MAX_KM = 50;
const MIN_MIN = 3.5;
const MAX_MIN = 300;

/** Oxygen cost (ml/kg/min) of running at v metres/min. */
function vo2Cost(vMperMin: number): number {
  return -4.6 + 0.182258 * vMperMin + 0.000104 * vMperMin * vMperMin;
}

/** Fraction of VO2max sustainable for t minutes. */
function pctMax(tMin: number): number {
  return 0.8 + 0.1894393 * Math.exp(-0.012778 * tMin) + 0.2989558 * Math.exp(-0.1932605 * tMin);
}

function rawVdot(distanceKm: number, timeSec: number): number {
  const tMin = timeSec / 60;
  const v = (distanceKm * 1000) / tMin;
  return vo2Cost(v) / pctMax(tMin);
}

/** Velocity (m/min) whose VO2 cost equals targetVo2 (positive root of the quadratic). */
function velocityForVo2(targetVo2: number): number | null {
  const a = 0.000104;
  const b = 0.182258;
  const c = -4.6 - targetVo2;
  const disc = b * b - 4 * a * c;
  if (!(disc >= 0)) return null;
  const v = (-b + Math.sqrt(disc)) / (2 * a);
  return isPos(v) ? v : null;
}

/** Pace (s/km) at a given fraction of VDOT. */
function paceAtPct(vdot: number, pct: number): number | null {
  const v = velocityForVo2(vdot * pct);
  return v === null ? null : 60000 / v;
}

/**
 * Solve race time for a VDOT and distance without enforcing the validity envelope.
 * rawVdot is strictly decreasing in t over the bracket, so bisection is safe.
 */
function solveRaceTime(vdot: number, distanceKm: number): number | null {
  if (!isPos(vdot) || !isPos(distanceKm)) return null;
  let lo = 1; // seconds
  let hi = 7 * 24 * 3600;
  const f = (t: number) => rawVdot(distanceKm, t) - vdot;
  if (!(f(lo) > 0) || !(f(hi) < 0)) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-6) break;
  }
  const t = (lo + hi) / 2;
  return isPos(t) ? t : null;
}

function inEnvelope(distanceKm: number, timeSec: number): boolean {
  const tMin = timeSec / 60;
  // small tolerance so exact boundary values survive floating-point noise
  return (
    distanceKm >= MIN_KM - 1e-9 &&
    distanceKm <= MAX_KM + 1e-9 &&
    tMin >= MIN_MIN - 1e-9 &&
    tMin <= MAX_MIN + 1e-9
  );
}

/** VO2 cost at velocity v (m/min): -4.60 + 0.182258 v + 0.000104 v^2;
 *  %VO2max sustainable for t minutes: 0.8 + 0.1894393 e^(-0.012778 t) + 0.2989558 e^(-0.1932605 t);
 *  VDOT = VO2 / %max. Valid for races ~1.5 km..50 km and 3.5..300 min (else null). */
export function vdotFromRace(distanceKm: number, timeSec: number): number | null {
  if (!isPos(distanceKm) || !isPos(timeSec)) return null;
  if (!inEnvelope(distanceKm, timeSec)) return null;
  const v = rawVdot(distanceKm, timeSec);
  return isPos(v) ? v : null;
}

/** Inverse: race time for a given VDOT and distance (numeric solve, bisection).
 *  Returns null if the solution falls outside the validity envelope. */
export function raceTimeFromVdot(vdot: number, distanceKm: number): number | null {
  if (!isPos(vdot) || !isPos(distanceKm)) return null;
  const t = solveRaceTime(vdot, distanceKm);
  if (t === null || !inEnvelope(distanceKm, t)) return null;
  return t;
}

export interface PaceRange {
  minSecPerKm: number; // faster bound
  maxSecPerKm: number; // slower bound
}

export interface TrainingPaces {
  easy: PaceRange;
  marathon: PaceRange;
  threshold: PaceRange;
  interval: PaceRange;
  repetition: PaceRange;
}

/** %VDOT bands used to derive training paces (fast bound first). */
const EASY = [0.69, 0.59] as const; // see CALC_API.md note: upper bound 69% matches Daniels' E-pace tables
const THRESHOLD = [0.88, 0.86] as const;
const INTERVAL = [1.0, 0.95] as const;
/** Repetition centre = interval (100%) pace − 15 s/km (≈ 6 s per 400 m), ± 2 s. */
const REP_OFFSET = 15;
const REP_HALF_RANGE = 2;

function band(vdot: number, [fastPct, slowPct]: readonly [number, number]): PaceRange | null {
  const fast = paceAtPct(vdot, fastPct);
  const slow = paceAtPct(vdot, slowPct);
  if (fast === null || slow === null) return null;
  return { minSecPerKm: fast, maxSecPerKm: slow };
}

/** Training paces for a VDOT (accepted range 10..100). */
export function trainingPaces(vdot: number): TrainingPaces | null {
  if (!isPos(vdot) || vdot < 10 || vdot > 100) return null;
  const easy = band(vdot, EASY);
  const threshold = band(vdot, THRESHOLD);
  const interval = band(vdot, INTERVAL);
  // Marathon pace = raceTimeFromVdot(vdot, 42.195); fall back to the unbounded solve if the
  // marathon time is outside the 300-min envelope (very low VDOT), so paces still render.
  const mTime = raceTimeFromVdot(vdot, 42.195) ?? solveRaceTime(vdot, 42.195);
  if (!easy || !threshold || !interval || mTime === null) return null;
  const mPace = mTime / 42.195;
  const repCentre = interval.minSecPerKm - REP_OFFSET;
  if (!(repCentre - REP_HALF_RANGE > 0)) return null;
  return {
    easy,
    marathon: { minSecPerKm: mPace, maxSecPerKm: mPace },
    threshold,
    interval,
    repetition: { minSecPerKm: repCentre - REP_HALF_RANGE, maxSecPerKm: repCentre + REP_HALF_RANGE },
  };
}
