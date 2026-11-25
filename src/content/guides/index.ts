import type { Guide } from "../types";
import { guide as paceCalculator } from "./pace-calculator";
import { guide as paceConverter } from "./pace-converter";
import { guide as raceTimePredictor } from "./race-time-predictor";
import { guide as vdotCalculator } from "./vdot-calculator";
import { guide as heartRateZones } from "./heart-rate-zones";
import { guide as marathonSplits } from "./marathon-splits";
import { guide as raceFuelingCalculator } from "./race-fueling-calculator";
import { guide as cadenceStrideCalculator } from "./cadence-stride-calculator";

/**
 * One file per tool slug in this folder (e.g. pace-calculator.ts exporting
 * `const guide: Guide`), registered in this map by slug.
 */
export const GUIDES: Record<string, Guide> = {
  [paceCalculator.slug]: paceCalculator,
  [paceConverter.slug]: paceConverter,
  [raceTimePredictor.slug]: raceTimePredictor,
  [vdotCalculator.slug]: vdotCalculator,
  [heartRateZones.slug]: heartRateZones,
  [marathonSplits.slug]: marathonSplits,
  [raceFuelingCalculator.slug]: raceFuelingCalculator,
  [cadenceStrideCalculator.slug]: cadenceStrideCalculator,
};

export function getGuide(slug: string): Guide | undefined {
  return GUIDES[slug];
}
