# Calc library contract (`src/lib/calc`)

Units: distance = km, duration = seconds, pace = seconds per km (unless the name says Mile/Mph).
All functions are pure. Invalid input → return `null` (never throw, never NaN).

## units.ts
```ts
export const KM_PER_MILE = 1.609344;
export interface RaceDistance { id: string; label: string; km: number }
export const RACE_DISTANCES: RaceDistance[]; // ids: "1k","1mile","5k","10k","15k","10mile","half","marathon","50k"
export function kmToMiles(km: number): number;
export function milesToKm(mi: number): number;
```

## time.ts
```ts
/** Accepts "h:mm:ss", "mm:ss", "m:ss", "ss", with optional decimals on seconds. Returns seconds or null. */
export function parseDuration(input: string): number | null;
/** 3725 -> "1:02:05"; 305 -> "5:05". forceHours => "0:05:05". Rounds to whole seconds. */
export function formatDuration(totalSec: number, opts?: { forceHours?: boolean }): string;
/** pace seconds -> "4:59" (mm:ss, rounded) */
export function formatPace(secPerUnit: number): string;
```

## pace.ts
```ts
export interface PaceSolution {
  distanceKm: number; timeSec: number;
  paceSecPerKm: number; paceSecPerMile: number;
  speedKmh: number; speedMph: number;
}
/** Provide exactly two of the three; returns the full solution or null. */
export function solvePace(input: { distanceKm?: number; timeSec?: number; paceSecPerKm?: number }): PaceSolution | null;
export function pacePerKmToPerMile(secPerKm: number): number;
export function pacePerMileToPerKm(secPerMile: number): number;
export function paceToKmh(secPerKm: number): number;
export function kmhToPace(kmh: number): number | null;
export function paceToMph(secPerKm: number): number;
export function mphToPacePerKm(mph: number): number | null;
```

## predictor.ts
```ts
/** Riegel: T2 = T1 * (D2/D1)^exponent, default exponent 1.06 */
export function riegelPredict(timeSec: number, fromKm: number, toKm: number, exponent?: number): number | null;
export interface Prediction { distance: RaceDistance; riegelSec: number; vdotSec: number | null; paceSecPerKm: number }
/** Predictions for all RACE_DISTANCES using Riegel and VDOT-equivalent times. */
export function predictAll(timeSec: number, fromKm: number): Prediction[];
```

## vdot.ts (Daniels–Gilbert equations)
```ts
/** VO2 cost at velocity v (m/min): -4.60 + 0.182258 v + 0.000104 v^2;
 *  %VO2max sustainable for t minutes: 0.8 + 0.1894393 e^(-0.012778 t) + 0.2989558 e^(-0.1932605 t);
 *  VDOT = VO2 / %max. Valid for races ~1.5 km..50 km and 3.5..300 min. */
export function vdotFromRace(distanceKm: number, timeSec: number): number | null;
/** Inverse: race time for a given VDOT and distance (numeric solve, bisection). */
export function raceTimeFromVdot(vdot: number, distanceKm: number): number | null;
export interface PaceRange { minSecPerKm: number; maxSecPerKm: number } // min = faster bound
export interface TrainingPaces {
  easy: PaceRange;        // ~59–74% VO2max
  marathon: PaceRange;    // marathon race pace for this VDOT (min==max ok)
  threshold: PaceRange;   // ~83–88% VO2max
  interval: PaceRange;    // ~95–100% VO2max
  repetition: PaceRange;  // ~105–110% of vVO2max-equivalent; can use interval pace − ~6s/400m
}
export function trainingPaces(vdot: number): TrainingPaces | null;
```

## hr.ts
```ts
export type MaxHrFormula = "fox" | "tanaka" | "gellish"; // 220-age | 208-0.7age | 207-0.7age
export function estimateMaxHr(age: number, formula?: MaxHrFormula): number | null;
export interface HrZone { zone: 1|2|3|4|5; name: string; minBpm: number; maxBpm: number; minPct: number; maxPct: number; purpose: string }
/** Karvonen: target = rest + pct*(max-rest). Zones 50-60,60-70,70-80,80-90,90-100 %. */
export function karvonenZones(maxHr: number, restHr: number): HrZone[] | null;
/** % of max HR, same pct bands. */
export function percentMaxZones(maxHr: number): HrZone[] | null;
```

## splits.ts
```ts
export interface SplitRow { index: number; label: string; distanceKm: number; splitSec: number; paceSecPerKm: number; cumulativeSec: number }
/** unit = size of each split ("km" or "mile"); last split may be partial.
 *  strategy "even" or "negative": first half slower by negativePct/2 %, second half faster, total == targetSec (±1s). */
export function splitPlan(input: { distanceKm: number; targetSec: number; unit: "km" | "mile"; strategy: "even" | "negative"; negativePct?: number }): SplitRow[] | null;
```

## fueling.ts
```ts
export interface FuelingPlan {
  totalCarbsG: number; carbsPerHour: number;
  gels: number; firstGelMin: number; gelIntervalMin: number; gelSchedule: number[]; // minutes from start
  fluidMlPerHour: number; totalFluidMl: number;
  sodiumMgPerHour: number;
}
/** Runs under 60 min → 0 gels. Default carbsPerHour 60, gelCarbs 25, first gel at ~30-45 min, fluid 400-800 ml/h (default 500), sodium default 400 mg/h. */
export function fuelingPlan(input: { durationSec: number; carbsPerHour?: number; gelCarbsG?: number; fluidMlPerHour?: number; sodiumMgPerHour?: number }): FuelingPlan | null;
```

## cadence.ts
```ts
/** stride length (m) = speed (m/min) / cadence (steps/min) */
export function strideLengthM(paceSecPerKm: number, cadenceSpm: number): number | null;
export function cadenceForPace(paceSecPerKm: number, strideM: number): number | null;
export function paceFromCadenceStride(cadenceSpm: number, strideM: number): number | null;
```

## vo2max.ts
```ts
/** Cooper 12-min test: (distance_m − 504.9) / 44.73. Accepts 1000..5000 m. */
export function cooperVo2max(distanceM: number): number | null;
/** Uth–Sørensen: 15.3 × HRmax / HRrest. Requires 20 ≤ rest < max ≤ 260. */
export function hrRatioVo2max(maxHr: number, restHr: number): number | null;
export type Sex = "male" | "female";
export type Vo2maxCategory = "Below average" | "Average" | "Good" | "Excellent";
export interface Vo2maxNormRow { minAge: number; maxAge: number | null; label: string; average: number; good: number; excellent: number }
/** Coarse "rough guide" bands (lower bounds, ml/kg/min) by sex and age band 18–29 … 60+. */
export const VO2MAX_NORMS: Record<Sex, Vo2maxNormRow[]>;
export function vo2maxNormRow(age: number, sex: Sex): Vo2maxNormRow | null; // age 18..120
export function vo2maxCategory(vo2max: number, age: number, sex: Sex): Vo2maxCategory | null;
```
For a race-based estimate use `vdotFromRace` (VDOT ≈ effective VO2max) and `raceTimeFromVdot` for equivalent times.

## calories.ts
```ts
/** ACSM running equation, gross VO2 (ml/kg/min) = 0.2·v + 0.9·v·grade + 3.5 (v in m/min, grade fraction).
 *  gradePct accepted 0..30. */
export function acsmRunningVo2(speedMPerMin: number, gradePct?: number): number | null;
export interface RunningCalories {
  distanceKm: number; durationSec: number; paceSecPerKm: number; gradePct: number;
  vo2MlKgMin: number;      // gross
  grossKcal: number;       // VO2 (L/min) × 5 × minutes
  netKcal: number;         // gross minus resting 3.5 ml/kg/min
  ruleOfThumbKcal: number; // 1 kcal/kg/km
  grossKcalPerHour: number; grossKcalPerKm: number;
  belowRunningSpeed: boolean; // speed < 134 m/min (≈ 8 km/h), outside the equation's intended range
}
/** weightKg plus exactly two of distanceKm / durationSec / paceSecPerKm.
 *  Accepted: weight 20..300 kg, duration ≤ 24 h, pace 120..1200 s/km, grade 0..30 %. */
export function runningCalories(input: { weightKg: number; distanceKm?: number; durationSec?: number; paceSecPerKm?: number; gradePct?: number }): RunningCalories | null;
```
Note: on the flat, ACSM net cost is exactly 1 kcal/kg/km (0.2 ml/kg/m × 5 kcal/L), so `netKcal` equals `ruleOfThumbKcal` at 0 % grade.

## Implementation notes (calc agent)
- Functions typed `number` (no `| null`) return `0` for invalid input (`kmToMiles`, `milesToKm`, `pacePerKmToPerMile`, `pacePerMileToPerKm`, `paceToKmh`, `paceToMph`). `formatDuration`/`formatPace` return `"--:--"` for invalid input. `predictAll` returns `[]` for invalid input.
- `parseDuration`: leading part unbounded ("90" = 90 s, "75:00" = 75 min); non-leading parts must be < 60; decimals only on the last part; at most 3 parts.
- `estimateMaxHr` default formula: `"tanaka"`; age accepted 1..120; result rounded to whole bpm.
- HR zone names: Recovery, Endurance (aerobic), Tempo, Threshold, VO2max. Boundaries computed once → zone N `maxBpm` === zone N+1 `minBpm`. Requires 0 < rest < max ≤ 260.
- `trainingPaces` (accepted VDOT 10..100) %VDOT bands: easy **59–69%** (upper bound tightened from ~74% so VDOT 50 easy ≈ 5:10–5:52/km, matching Daniels' tables), threshold 86–88% (VDOT 50 ≈ 4:15–4:20/km), interval 95–100%, marathon = `raceTimeFromVdot(vdot, 42.195)/42.195` (falls back to the unbounded solve when the marathon exceeds 300 min), repetition = interval(100%) − 15 s/km ± 2 s.
- `vdotFromRace`/`raceTimeFromVdot` return null outside 1.5–50 km / 3.5–300 min.
- `splitPlan`: halves are by distance; a split straddling halfway gets a distance-weighted mix of the slow/fast paces; `splitSec` is unrounded (format in UI). `negativePct` accepted 0..20; label = cumulative distance at split end ("42.195 km", "26.22 mi"); max 1000 splits.
- `fuelingPlan`: first gel at 35 min, interval = 60·gelCarbsG/carbsPerHour (reported rounded to 0.1 min; schedule minutes rounded to whole minutes), no gel after `duration − 15 min`. `totalCarbsG = gels × gelCarbsG` (carbs actually taken). Under 60 min: gels 0, schedule [], totalCarbsG 0. Accepted: duration ≤ 48 h, carbsPerHour 1..150, sodium ≥ 0.
