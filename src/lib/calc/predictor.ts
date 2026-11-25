import { RACE_DISTANCES, type RaceDistance } from "./units";
import { raceTimeFromVdot, vdotFromRace } from "./vdot";
import { isPos } from "./_util";

/** Riegel: T2 = T1 * (D2/D1)^exponent, default exponent 1.06 */
export function riegelPredict(
  timeSec: number,
  fromKm: number,
  toKm: number,
  exponent: number = 1.06,
): number | null {
  if (!isPos(timeSec) || !isPos(fromKm) || !isPos(toKm) || !isPos(exponent)) return null;
  const t = timeSec * Math.pow(toKm / fromKm, exponent);
  return isPos(t) ? t : null;
}

export interface Prediction {
  distance: RaceDistance;
  riegelSec: number;
  vdotSec: number | null;
  paceSecPerKm: number; // from riegelSec
}

/** Predictions for all RACE_DISTANCES using Riegel and VDOT-equivalent times.
 *  Invalid input returns []. vdotSec is null where the input or target is outside the VDOT envelope. */
export function predictAll(timeSec: number, fromKm: number): Prediction[] {
  if (!isPos(timeSec) || !isPos(fromKm)) return [];
  const vdot = vdotFromRace(fromKm, timeSec);
  const out: Prediction[] = [];
  for (const distance of RACE_DISTANCES) {
    const riegelSec = riegelPredict(timeSec, fromKm, distance.km);
    if (riegelSec === null) return [];
    out.push({
      distance,
      riegelSec,
      vdotSec: vdot === null ? null : raceTimeFromVdot(vdot, distance.km),
      paceSecPerKm: riegelSec / distance.km,
    });
  }
  return out;
}
