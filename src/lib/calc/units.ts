import { isFiniteNum } from "./_util";

export const KM_PER_MILE = 1.609344;

export interface RaceDistance {
  id: string;
  label: string;
  km: number;
}

export const RACE_DISTANCES: RaceDistance[] = [
  { id: "1k", label: "1K", km: 1 },
  { id: "1mile", label: "1 Mile", km: KM_PER_MILE },
  { id: "5k", label: "5K", km: 5 },
  { id: "10k", label: "10K", km: 10 },
  { id: "15k", label: "15K", km: 15 },
  { id: "10mile", label: "10 Miles", km: 10 * KM_PER_MILE },
  { id: "half", label: "Half Marathon", km: 21.0975 },
  { id: "marathon", label: "Marathon", km: 42.195 },
  { id: "50k", label: "50K", km: 50 },
];

/** Non-finite input returns 0 (never NaN). */
export function kmToMiles(km: number): number {
  return isFiniteNum(km) ? km / KM_PER_MILE : 0;
}

/** Non-finite input returns 0 (never NaN). */
export function milesToKm(mi: number): number {
  return isFiniteNum(mi) ? mi * KM_PER_MILE : 0;
}
