import { isPos } from "./_util";

export interface FuelingPlan {
  totalCarbsG: number; // always gels * gelCarbsG
  carbsPerHour: number;
  gels: number;
  firstGelMin: number;
  gelIntervalMin: number;
  gelSchedule: number[]; // whole minutes from start
  fluidMlPerHour: number;
  totalFluidMl: number;
  sodiumMgPerHour: number;
}

const FIRST_GEL_MIN = 35;
const NO_GEL_LAST_MIN = 15;
const MAX_DURATION_SEC = 48 * 3600;

/** Runs under 60 min → 0 gels, empty schedule, totalCarbsG 0.
 *  Otherwise: first gel at 35 min, then every gelIntervalMin = 60*gelCarbsG/carbsPerHour minutes,
 *  no gel in the final 15 minutes. totalCarbsG = gels * gelCarbsG (carbs actually taken via gels).
 *  Defaults: carbsPerHour 60 (accepted 1..150), gelCarbsG 25, fluid 500 ml/h, sodium 400 mg/h. */
export function fuelingPlan(input: {
  durationSec: number;
  carbsPerHour?: number;
  gelCarbsG?: number;
  fluidMlPerHour?: number;
  sodiumMgPerHour?: number;
}): FuelingPlan | null {
  if (!input || typeof input !== "object") return null;
  const { durationSec } = input;
  const carbsPerHour = input.carbsPerHour ?? 60;
  const gelCarbsG = input.gelCarbsG ?? 25;
  const fluidMlPerHour = input.fluidMlPerHour ?? 500;
  const sodiumMgPerHour = input.sodiumMgPerHour ?? 400;
  if (!isPos(durationSec) || durationSec > MAX_DURATION_SEC) return null;
  if (!isPos(carbsPerHour) || carbsPerHour > 150) return null;
  if (!isPos(gelCarbsG) || gelCarbsG > 200) return null;
  if (!isPos(fluidMlPerHour) || fluidMlPerHour > 3000) return null;
  if (typeof sodiumMgPerHour !== "number" || !Number.isFinite(sodiumMgPerHour) || sodiumMgPerHour < 0) return null;

  const durationMin = durationSec / 60;
  const intervalRaw = (60 * gelCarbsG) / carbsPerHour;
  const gelIntervalMin = Math.round(intervalRaw * 10) / 10;
  const firstGelMin = Math.min(FIRST_GEL_MIN, Math.max(0, Math.floor(durationMin - NO_GEL_LAST_MIN)));

  const gelSchedule: number[] = [];
  if (durationMin >= 60) {
    const lastAllowed = durationMin - NO_GEL_LAST_MIN;
    for (let k = 0; ; k++) {
      const m = Math.round(firstGelMin + k * intervalRaw);
      if (m > lastAllowed || gelSchedule.length >= 1000) break;
      if (gelSchedule.length === 0 || m > gelSchedule[gelSchedule.length - 1]) gelSchedule.push(m);
    }
  }
  const gels = gelSchedule.length;
  return {
    totalCarbsG: gels * gelCarbsG,
    carbsPerHour,
    gels,
    firstGelMin,
    gelIntervalMin,
    gelSchedule,
    fluidMlPerHour,
    totalFluidMl: Math.round((fluidMlPerHour * durationMin) / 60),
    sodiumMgPerHour,
  };
}
