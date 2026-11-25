import { isFiniteNum, isPos } from "./_util";

/** Resting oxygen uptake (1 MET), ml/kg/min. */
const REST_VO2 = 3.5;
/** kcal per litre of O2 (ACSM rounding). */
const KCAL_PER_L_O2 = 5;
/** ACSM running equation is intended for speeds above ~134 m/min (≈ 8 km/h, 7:28/km). */
const ACSM_MIN_RUN_M_PER_MIN = 134;
const MAX_GRADE_PCT = 30;

/** ACSM running equation, gross VO2 (ml/kg/min):
 *  VO2 = 0.2·speed + 0.9·speed·grade + 3.5, speed in m/min, grade as a fraction.
 *  Grade accepted 0..30 % (the equation is not valid downhill). */
export function acsmRunningVo2(speedMPerMin: number, gradePct = 0): number | null {
  if (!isPos(speedMPerMin) || !isFiniteNum(gradePct) || gradePct < 0 || gradePct > MAX_GRADE_PCT) return null;
  const g = gradePct / 100;
  return 0.2 * speedMPerMin + 0.9 * speedMPerMin * g + REST_VO2;
}

export interface RunningCalories {
  distanceKm: number;
  durationSec: number;
  paceSecPerKm: number;
  gradePct: number;
  /** Gross VO2, ml/kg/min (includes resting 3.5). */
  vo2MlKgMin: number;
  /** Gross energy: VO2 (L/min) × 5 kcal/L × minutes. */
  grossKcal: number;
  /** Net energy: gross minus resting (3.5 ml/kg/min) over the same time. */
  netKcal: number;
  /** Rule of thumb: 1 kcal per kg per km. */
  ruleOfThumbKcal: number;
  grossKcalPerHour: number;
  grossKcalPerKm: number;
  /** True when speed is below the ACSM running equation's intended range (≈ 8 km/h). */
  belowRunningSpeed: boolean;
}

/**
 * Energy cost of a run. Provide weightKg plus exactly two of distanceKm, durationSec, paceSecPerKm.
 * Accepted: weight 20..300 kg, duration ≤ 24 h, pace 120..1200 s/km, grade 0..30 %.
 */
export function runningCalories(input: {
  weightKg: number;
  distanceKm?: number;
  durationSec?: number;
  paceSecPerKm?: number;
  gradePct?: number;
}): RunningCalories | null {
  const { weightKg, gradePct = 0 } = input;
  if (!isPos(weightKg) || weightKg < 20 || weightKg > 300) return null;

  const given = [input.distanceKm, input.durationSec, input.paceSecPerKm].filter((v) => v !== undefined);
  if (given.length !== 2) return null;

  let distanceKm: number;
  let durationSec: number;
  if (input.distanceKm !== undefined && input.durationSec !== undefined) {
    distanceKm = input.distanceKm;
    durationSec = input.durationSec;
  } else if (input.distanceKm !== undefined && input.paceSecPerKm !== undefined) {
    distanceKm = input.distanceKm;
    durationSec = input.distanceKm * input.paceSecPerKm;
  } else if (input.durationSec !== undefined && input.paceSecPerKm !== undefined) {
    durationSec = input.durationSec;
    distanceKm = isPos(input.paceSecPerKm) ? input.durationSec / input.paceSecPerKm : NaN;
  } else {
    return null;
  }
  if (!isPos(distanceKm) || !isPos(durationSec) || durationSec > 24 * 3600) return null;

  const paceSecPerKm = durationSec / distanceKm;
  if (paceSecPerKm < 120 || paceSecPerKm > 1200) return null;

  const minutes = durationSec / 60;
  const speed = (distanceKm * 1000) / minutes;
  const vo2 = acsmRunningVo2(speed, gradePct);
  if (vo2 == null) return null;

  const kcalPerMinPerMl = (weightKg / 1000) * KCAL_PER_L_O2;
  const grossKcal = vo2 * kcalPerMinPerMl * minutes;
  const netKcal = (vo2 - REST_VO2) * kcalPerMinPerMl * minutes;

  return {
    distanceKm,
    durationSec,
    paceSecPerKm,
    gradePct,
    vo2MlKgMin: vo2,
    grossKcal,
    netKcal,
    ruleOfThumbKcal: weightKg * distanceKm,
    grossKcalPerHour: grossKcal / (minutes / 60),
    grossKcalPerKm: grossKcal / distanceKm,
    belowRunningSpeed: speed < ACSM_MIN_RUN_M_PER_MIN,
  };
}
