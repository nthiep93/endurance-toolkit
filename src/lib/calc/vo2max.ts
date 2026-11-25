import { isPos } from "./_util";

/** Accepted Cooper 12-minute distance, metres (anything outside is almost certainly a typo). */
const COOPER_MIN_M = 1000;
const COOPER_MAX_M = 5000;

/** Cooper 12-minute test: VO2max = (distance_m − 504.9) / 44.73 (ml/kg/min).
 *  Accepts 1000..5000 m. */
export function cooperVo2max(distanceM: number): number | null {
  if (!isPos(distanceM) || distanceM < COOPER_MIN_M || distanceM > COOPER_MAX_M) return null;
  const v = (distanceM - 504.9) / 44.73;
  return isPos(v) ? v : null;
}

/** Uth–Sørensen heart-rate ratio: VO2max ≈ 15.3 × HRmax / HRrest (ml/kg/min).
 *  Requires 20 ≤ restHr < maxHr ≤ 260. */
export function hrRatioVo2max(maxHr: number, restHr: number): number | null {
  if (!isPos(maxHr) || !isPos(restHr) || maxHr > 260 || restHr < 20 || restHr >= maxHr) return null;
  const v = (15.3 * maxHr) / restHr;
  return isPos(v) ? v : null;
}

export type Sex = "male" | "female";
export type Vo2maxCategory = "Below average" | "Average" | "Good" | "Excellent";

export interface Vo2maxNormRow {
  /** Lower bound of the age band (inclusive). */
  minAge: number;
  /** Upper bound (inclusive); null = open-ended. */
  maxAge: number | null;
  label: string;
  /** Lower bounds (ml/kg/min) for Average, Good, Excellent. Below `average` = Below average. */
  average: number;
  good: number;
  excellent: number;
}

/** Deliberately coarse "rough guide" bands, rounded from commonly cited adult norms
 *  (Cooper Institute / ACSM-style tables). Not a clinical classification. */
export const VO2MAX_NORMS: Record<Sex, Vo2maxNormRow[]> = {
  male: [
    { minAge: 18, maxAge: 29, label: "18–29", average: 38, good: 44, excellent: 51 },
    { minAge: 30, maxAge: 39, label: "30–39", average: 36, good: 42, excellent: 48 },
    { minAge: 40, maxAge: 49, label: "40–49", average: 34, good: 39, excellent: 45 },
    { minAge: 50, maxAge: 59, label: "50–59", average: 31, good: 36, excellent: 42 },
    { minAge: 60, maxAge: null, label: "60+", average: 27, good: 32, excellent: 38 },
  ],
  female: [
    { minAge: 18, maxAge: 29, label: "18–29", average: 33, good: 38, excellent: 44 },
    { minAge: 30, maxAge: 39, label: "30–39", average: 31, good: 36, excellent: 41 },
    { minAge: 40, maxAge: 49, label: "40–49", average: 29, good: 33, excellent: 38 },
    { minAge: 50, maxAge: 59, label: "50–59", average: 26, good: 30, excellent: 35 },
    { minAge: 60, maxAge: null, label: "60+", average: 23, good: 27, excellent: 32 },
  ],
};

/** Norm row for an adult age (18..120), else null. */
export function vo2maxNormRow(age: number, sex: Sex): Vo2maxNormRow | null {
  const rows = VO2MAX_NORMS[sex];
  if (!rows || !isPos(age) || age < 18 || age > 120) return null;
  return rows.find((r) => age >= r.minAge && (r.maxAge == null || age <= r.maxAge)) ?? null;
}

/** Coarse category for a VO2max at an age/sex (rough guide only). */
export function vo2maxCategory(vo2max: number, age: number, sex: Sex): Vo2maxCategory | null {
  if (!isPos(vo2max)) return null;
  const r = vo2maxNormRow(age, sex);
  if (!r) return null;
  if (vo2max >= r.excellent) return "Excellent";
  if (vo2max >= r.good) return "Good";
  if (vo2max >= r.average) return "Average";
  return "Below average";
}
