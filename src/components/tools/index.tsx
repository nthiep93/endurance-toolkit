"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Map slug -> interactive tool component, code-split per tool: each page only ships the JS for
 * its own calculator (still server-rendered, so content is in the HTML for SEO).
 * Every component: default export, no props, "use client", mobile-first.
 */
const loading = () => <div className="min-h-[420px] animate-pulse rounded-2xl bg-surface-2" aria-hidden />;

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "pace-calculator": dynamic(() => import("./PaceCalculator"), { loading }),
  "pace-converter": dynamic(() => import("./PaceConverter"), { loading }),
  "race-time-predictor": dynamic(() => import("./RaceTimePredictor"), { loading }),
  "vdot-calculator": dynamic(() => import("./VdotCalculator"), { loading }),
  "heart-rate-zones": dynamic(() => import("./HeartRateZones"), { loading }),
  "marathon-splits": dynamic(() => import("./MarathonSplits"), { loading }),
  "race-fueling-calculator": dynamic(() => import("./RaceFuelingCalculator"), { loading }),
  "cadence-stride-calculator": dynamic(() => import("./CadenceStrideCalculator"), { loading }),
  "vo2max-estimator": dynamic(() => import("./Vo2maxEstimator"), { loading }),
  "running-calories-calculator": dynamic(() => import("./RunningCaloriesCalculator"), { loading }),
};

export function ToolRenderer({ slug }: { slug: string }) {
  const Comp = TOOL_COMPONENTS[slug];
  if (!Comp) {
    return <p className="text-sm text-muted">This tool is coming soon.</p>;
  }
  return <Comp />;
}
