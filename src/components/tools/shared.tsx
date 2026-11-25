"use client";

import type { ReactNode } from "react";

import {
  RACE_DISTANCES,
  formatPace,
  kmToMiles,
  milesToKm,
  pacePerKmToPerMile,
  pacePerMileToPerKm,
  parseDuration,
} from "@/lib/calc";
import { NumberInput, Segmented, Select } from "@/components/ui";

export type DistUnit = "km" | "mile";

export const UNIT_OPTIONS = [
  { value: "km", label: "km" },
  { value: "mile", label: "mile" },
] as const satisfies ReadonlyArray<{ value: DistUnit; label: string }>;

export const paceSuffix = (u: DistUnit) => (u === "km" ? "/km" : "/mi");

/** Parse a user-entered number; empty/invalid → null. */
export function parseNum(s: string): number | null {
  const t = s.trim().replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** "4:59 /km" from seconds-per-km, shown in the chosen unit. */
export function fmtPace(secPerKm: number, unit: DistUnit, withSuffix = true): string {
  const v = unit === "km" ? secPerKm : pacePerKmToPerMile(secPerKm);
  return withSuffix ? `${formatPace(v)} ${paceSuffix(unit)}` : formatPace(v);
}

/** Parse a pace string entered in `unit` → seconds per km. */
export function parsePace(input: string, unit: DistUnit): number | null {
  const s = parseDuration(input);
  if (s == null || s <= 0) return null;
  return unit === "km" ? s : pacePerMileToPerKm(s);
}

export function fmtNum(n: number, digits = 1): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtKm(km: number): string {
  return `${fmtNum(km, km % 1 === 0 ? 0 : 2)} km`;
}

export function fmtDistance(km: number): string {
  return `${fmtKm(km)} (${fmtNum(kmToMiles(km), 2)} mi)`;
}

/** "h:mm" from minutes, e.g. 35 → "0:35", 95 → "1:35". */
export function fmtHM(totalMin: number): string {
  const m = Math.round(totalMin);
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}

/** Standard race presets shown in distance pickers. */
const PRESET_IDS = ["5k", "10k", "half", "marathon"];

export interface DistanceValue {
  preset: string; // a RACE_DISTANCES id or "custom"
  custom: string;
  customUnit: DistUnit;
}

export function distanceValue(preset: string): DistanceValue {
  return { preset, custom: "10", customUnit: "km" };
}

export function resolveDistanceKm(v: DistanceValue): number | null {
  if (v.preset !== "custom") return RACE_DISTANCES.find((d) => d.id === v.preset)?.km ?? null;
  const n = parseNum(v.custom);
  if (n == null || n <= 0 || n > 1000) return null;
  return v.customUnit === "km" ? n : milesToKm(n);
}

export function distanceLabel(v: DistanceValue): string {
  if (v.preset === "custom") {
    const km = resolveDistanceKm(v);
    return km ? fmtKm(km) : "custom distance";
  }
  return RACE_DISTANCES.find((d) => d.id === v.preset)?.label ?? v.preset;
}

function distanceOptions(all: boolean) {
  const list = all ? RACE_DISTANCES : RACE_DISTANCES.filter((d) => PRESET_IDS.includes(d.id));
  return [...list.map((d) => ({ value: d.id, label: d.label })), { value: "custom", label: "Custom…" }];
}

interface DistanceFieldProps {
  label?: string;
  value: DistanceValue;
  onChange: (v: DistanceValue) => void;
  /** Show every RACE_DISTANCES entry rather than the 4 classics. */
  allPresets?: boolean;
}

/** Race preset select + optional custom distance with km/mile toggle. */
export function DistanceField({ label = "Distance", value, onChange, allPresets }: DistanceFieldProps) {
  const isCustom = value.preset === "custom";
  const customErr = isCustom && resolveDistanceKm(value) == null ? "Enter a distance greater than 0." : undefined;
  return (
    <div className="flex flex-col gap-3">
      <Select
        label={label}
        value={value.preset}
        onChange={(preset) => onChange({ ...value, preset })}
        options={distanceOptions(!!allPresets)}
      />
      {isCustom && (
        <div className="flex flex-wrap items-end gap-3">
          <NumberInput
            label="Custom distance"
            value={value.custom}
            onChange={(custom) => onChange({ ...value, custom })}
            min={0}
            step="any"
            error={customErr}
            className="min-w-32 flex-1"
          />
          <Segmented
            label="Custom distance unit"
            hideLabel
            value={value.customUnit}
            onChange={(customUnit) => onChange({ ...value, customUnit })}
            options={UNIT_OPTIONS}
          />
        </div>
      )}
    </div>
  );
}

/** Small km/mile toggle for result areas. */
export function UnitToggle({
  value,
  onChange,
  label = "Pace unit",
}: {
  value: DistUnit;
  onChange: (u: DistUnit) => void;
  label?: string;
}) {
  return (
    <Segmented
      label={label}
      hideLabel
      size="sm"
      value={value}
      onChange={onChange}
      options={[
        { value: "km", label: "min/km" },
        { value: "mile", label: "min/mile" },
      ]}
    />
  );
}

/** Validation message for a duration string. */
export function durationError(input: string, what = "time"): string | undefined {
  if (!input.trim()) return `Enter a ${what}.`;
  const s = parseDuration(input);
  if (s == null || s <= 0) return `Use h:mm:ss or mm:ss, e.g. 3:59:30 or 25:00.`;
  return undefined;
}

/** ~2:10/km is faster than the mile world record; anything quicker almost always means
 *  "3:30" (= 3 min 30 s) was typed for "3:30:00". */
const IMPLAUSIBLE_PACE_SEC_PER_KM = 130;

/** Warning for a time that implies a humanly impossible pace over the given distance. */
export function implausibleTimeWarning(timeSec: number | null | undefined, km: number | null | undefined) {
  if (!timeSec || !km || timeSec <= 0 || km <= 0) return undefined;
  return timeSec / km < IMPLAUSIBLE_PACE_SEC_PER_KM
    ? "That's faster than world-record pace — for hours use h:mm:ss, e.g. 3:30:00."
    : undefined;
}

/** Distance with up to 3 decimals, trailing zeros trimmed: 42.195, 10, 4.99. */
export function fmtDistNum(km: number): string {
  return km.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 3 });
}

export function EmptyResult({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">{children}</p>;
}
