/**
 * Single source of truth for every tool on the site.
 * Adding a tool = add an entry here + a component in src/components/tools + a guide in src/content/guides.
 */
export type ToolCategory = "pace" | "race" | "training" | "nutrition";

export interface ToolMeta {
  slug: string;
  name: string;
  /** <title> — keep under ~60 chars, primary keyword first */
  seoTitle: string;
  /** meta description — under ~155 chars */
  seoDescription: string;
  /** one-line card summary */
  summary: string;
  category: ToolCategory;
  primaryKeyword: string;
  secondaryKeywords: string[];
  related: string[];
  emoji: string;
}

export const CATEGORIES: Record<ToolCategory, { label: string; description: string }> = {
  pace: { label: "Pace & Speed", description: "Convert and solve pace, time, distance and speed." },
  race: { label: "Race Planning", description: "Predict race times and plan your splits." },
  training: { label: "Training", description: "Training paces, heart rate zones and running form." },
  nutrition: { label: "Fueling", description: "Carbs, gels and fluids for race day." },
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "pace-calculator",
    name: "Running Pace Calculator",
    seoTitle: "Running Pace Calculator – Pace, Time & Distance (km/mile)",
    seoDescription:
      "Calculate running pace, finish time or distance in seconds. Supports min/km and min/mile for 5K, 10K, half marathon and marathon.",
    summary: "Enter any two of distance, time and pace to solve the third.",
    category: "pace",
    primaryKeyword: "running pace calculator",
    secondaryKeywords: ["pace calculator", "marathon pace calculator", "min per km calculator"],
    related: ["pace-converter", "race-time-predictor", "marathon-splits"],
    emoji: "⏱️",
  },
  {
    slug: "pace-converter",
    name: "Pace & Treadmill Speed Converter",
    seoTitle: "Pace Converter – min/km ↔ min/mile ↔ km/h ↔ mph (Treadmill)",
    seoDescription:
      "Convert running pace between min/km, min/mile, km/h and mph instantly. Perfect for treadmill runs. Includes a full conversion chart.",
    summary: "Convert between min/km, min/mile, km/h and mph — treadmill friendly.",
    category: "pace",
    primaryKeyword: "pace converter",
    secondaryKeywords: ["treadmill pace converter", "mph to min per mile", "km/h to min/km"],
    related: ["pace-calculator", "cadence-stride-calculator"],
    emoji: "🔁",
  },
  {
    slug: "race-time-predictor",
    name: "Race Time Predictor",
    seoTitle: "Race Time Predictor – 5K, 10K, Half & Marathon Finish Time",
    seoDescription:
      "Predict your 5K, 10K, half marathon and marathon times from a recent race using the Riegel formula and VDOT equivalents.",
    summary: "Predict finish times for other distances from one recent race.",
    category: "race",
    primaryKeyword: "race time predictor",
    secondaryKeywords: ["marathon time predictor", "half marathon time predictor", "riegel formula calculator"],
    related: ["vdot-calculator", "marathon-splits", "pace-calculator"],
    emoji: "🔮",
  },
  {
    slug: "vdot-calculator",
    name: "VDOT Calculator & Training Paces",
    seoTitle: "VDOT Calculator – Jack Daniels Training Paces (E, M, T, I, R)",
    seoDescription:
      "Find your VDOT from a recent race and get Easy, Marathon, Threshold, Interval and Repetition training paces based on Daniels' formula.",
    summary: "Get your VDOT score and Daniels-style training paces.",
    category: "training",
    primaryKeyword: "vdot calculator",
    secondaryKeywords: ["training pace calculator", "jack daniels running calculator", "threshold pace calculator"],
    related: ["race-time-predictor", "heart-rate-zones", "vo2max-estimator"],
    emoji: "📈",
  },
  {
    slug: "heart-rate-zones",
    name: "Heart Rate Zone Calculator",
    seoTitle: "Heart Rate Zone Calculator for Running (Karvonen & %Max)",
    seoDescription:
      "Calculate your 5 running heart rate zones using the Karvonen (heart rate reserve) or % of max HR method. Includes max HR estimates.",
    summary: "Five training zones from max and resting heart rate.",
    category: "training",
    primaryKeyword: "heart rate zone calculator",
    secondaryKeywords: ["running heart rate zones", "karvonen formula calculator", "zone 2 heart rate calculator"],
    related: ["vdot-calculator", "pace-calculator"],
    emoji: "❤️",
  },
  {
    slug: "marathon-splits",
    name: "Marathon Split Calculator",
    seoTitle: "Marathon Split Calculator – Even & Negative Split Pace Plan",
    seoDescription:
      "Build a km-by-km or mile-by-mile split plan for any race and goal time. Choose even or negative splits and print your pace band.",
    summary: "Km-by-km or mile-by-mile pace plan with even or negative splits.",
    category: "race",
    primaryKeyword: "marathon split calculator",
    secondaryKeywords: ["negative split calculator", "pace band generator", "half marathon splits"],
    related: ["pace-calculator", "race-fueling-calculator", "race-time-predictor"],
    emoji: "🧭",
  },
  {
    slug: "race-fueling-calculator",
    name: "Race Fueling Calculator",
    seoTitle: "Marathon Fueling Calculator – Carbs, Gels & Fluids per Hour",
    seoDescription:
      "Plan your race-day nutrition: total carbs, number of gels, when to take them and fluid targets based on your finish time.",
    summary: "How many gels, how often, and how much to drink on race day.",
    category: "nutrition",
    primaryKeyword: "marathon fueling calculator",
    secondaryKeywords: ["how many gels for a marathon", "carbs per hour running", "race nutrition calculator"],
    related: ["marathon-splits", "race-time-predictor", "running-calories-calculator"],
    emoji: "🍯",
  },
  {
    slug: "cadence-stride-calculator",
    name: "Cadence & Stride Length Calculator",
    seoTitle: "Running Cadence & Stride Length Calculator",
    seoDescription:
      "Calculate stride length from pace and cadence, or the cadence you need for a target pace. Understand your running form numbers.",
    summary: "Relate pace, cadence (steps/min) and stride length.",
    category: "training",
    primaryKeyword: "stride length calculator",
    secondaryKeywords: ["running cadence calculator", "steps per minute running", "cadence pace calculator"],
    related: ["pace-converter", "heart-rate-zones"],
    emoji: "👟",
  },
  {
    slug: "vo2max-estimator",
    name: "VO2max Estimator",
    seoTitle: "VO2max Calculator for Runners – Race, Cooper & HR Methods",
    seoDescription:
      "Estimate your VO2max from a race result (VDOT), the Cooper 12-minute test or resting heart rate, with a rough fitness category and race potential.",
    summary: "Estimate VO2max from a race, a Cooper test or your heart rate.",
    category: "training",
    primaryKeyword: "vo2max calculator",
    secondaryKeywords: ["vo2 max estimator", "cooper test calculator", "vo2max from race time"],
    related: ["vdot-calculator", "heart-rate-zones", "race-time-predictor"],
    emoji: "🫁",
  },
  {
    slug: "running-calories-calculator",
    name: "Running Calories Burned Calculator",
    seoTitle: "Running Calories Burned Calculator – ACSM Equation",
    seoDescription:
      "Estimate energy used on a run from body weight, distance or pace and incline with the ACSM running equation, compared to the 1 kcal/kg/km rule.",
    summary: "Energy cost of a run from weight, distance, pace and incline.",
    category: "nutrition",
    primaryKeyword: "running calories burned calculator",
    secondaryKeywords: ["calories burned running", "acsm running equation calculator", "calories per km running"],
    related: ["race-fueling-calculator", "pace-calculator", "vo2max-estimator"],
    emoji: "🔥",
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}
