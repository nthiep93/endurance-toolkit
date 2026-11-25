"use client";

import type { ComponentType } from "react";
import PaceCalculator from "./PaceCalculator";
import PaceConverter from "./PaceConverter";
import RaceTimePredictor from "./RaceTimePredictor";
import VdotCalculator from "./VdotCalculator";
import HeartRateZones from "./HeartRateZones";
import MarathonSplits from "./MarathonSplits";
import RaceFuelingCalculator from "./RaceFuelingCalculator";
import CadenceStrideCalculator from "./CadenceStrideCalculator";

/**
 * Map slug -> interactive tool component. The UI agent creates one component per tool
 * in this folder and registers it here. Every component: default export, no props,
 * "use client", state in React only (no localStorage required), mobile-first.
 */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "pace-calculator": PaceCalculator,
  "pace-converter": PaceConverter,
  "race-time-predictor": RaceTimePredictor,
  "vdot-calculator": VdotCalculator,
  "heart-rate-zones": HeartRateZones,
  "marathon-splits": MarathonSplits,
  "race-fueling-calculator": RaceFuelingCalculator,
  "cadence-stride-calculator": CadenceStrideCalculator,
};

export function ToolRenderer({ slug }: { slug: string }) {
  const Comp = TOOL_COMPONENTS[slug];
  if (!Comp) {
    return <p className="text-sm text-muted">This tool is coming soon.</p>;
  }
  return <Comp />;
}
