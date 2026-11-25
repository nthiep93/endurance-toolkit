import { KM_PER_MILE } from "./units";
import { isPos } from "./_util";

export interface PaceSolution {
  distanceKm: number;
  timeSec: number;
  paceSecPerKm: number;
  paceSecPerMile: number;
  speedKmh: number;
  speedMph: number;
}

/** Provide exactly two of the three (each finite and > 0); returns the full solution or null. */
export function solvePace(input: {
  distanceKm?: number;
  timeSec?: number;
  paceSecPerKm?: number;
}): PaceSolution | null {
  if (!input || typeof input !== "object") return null;
  const { distanceKm, timeSec, paceSecPerKm } = input;
  const given = [distanceKm, timeSec, paceSecPerKm].filter((v) => v !== undefined && v !== null);
  if (given.length !== 2) return null;
  let d: number, t: number, p: number;
  if (distanceKm === undefined || distanceKm === null) {
    if (!isPos(timeSec) || !isPos(paceSecPerKm)) return null;
    t = timeSec;
    p = paceSecPerKm;
    d = t / p;
  } else if (timeSec === undefined || timeSec === null) {
    if (!isPos(distanceKm) || !isPos(paceSecPerKm)) return null;
    d = distanceKm;
    p = paceSecPerKm;
    t = d * p;
  } else {
    if (!isPos(distanceKm) || !isPos(timeSec)) return null;
    d = distanceKm;
    t = timeSec;
    p = t / d;
  }
  if (![d, t, p].every(isPos)) return null;
  const speedKmh = 3600 / p;
  return {
    distanceKm: d,
    timeSec: t,
    paceSecPerKm: p,
    paceSecPerMile: p * KM_PER_MILE,
    speedKmh,
    speedMph: speedKmh / KM_PER_MILE,
  };
}

/** Invalid (<= 0 / non-finite) input returns 0. */
export function pacePerKmToPerMile(secPerKm: number): number {
  return isPos(secPerKm) ? secPerKm * KM_PER_MILE : 0;
}

/** Invalid (<= 0 / non-finite) input returns 0. */
export function pacePerMileToPerKm(secPerMile: number): number {
  return isPos(secPerMile) ? secPerMile / KM_PER_MILE : 0;
}

/** Invalid (<= 0 / non-finite) input returns 0. */
export function paceToKmh(secPerKm: number): number {
  return isPos(secPerKm) ? 3600 / secPerKm : 0;
}

export function kmhToPace(kmh: number): number | null {
  return isPos(kmh) ? 3600 / kmh : null;
}

/** Invalid (<= 0 / non-finite) input returns 0. */
export function paceToMph(secPerKm: number): number {
  return isPos(secPerKm) ? 3600 / secPerKm / KM_PER_MILE : 0;
}

export function mphToPacePerKm(mph: number): number | null {
  return isPos(mph) ? 3600 / (mph * KM_PER_MILE) : null;
}
