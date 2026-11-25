"use client";

import { useMemo, useState } from "react";
import { formatDuration, kmToMiles, milesToKm, parseDuration, runningCalories } from "@/lib/calc";
import { Card, CopyButton, NumberInput, ResultStat, ResultTable, Segmented, ShareButton, StatGrid, TextInput } from "@/components/ui";
import {
  EmptyResult,
  UNIT_OPTIONS,
  durationError,
  fmtNum,
  fmtPace,
  paceSuffix,
  parseNum,
  parsePace,
  type DistUnit,
} from "./shared";
import { DIST_UNIT_TOKENS, enumField, isDuration, numIn, textField, tokenValue, useUrlState } from "./useUrlState";

type WeightUnit = "kg" | "lb";
type Mode = "distance" | "duration";

const LB_PER_KG = 2.2046226218;

const WEIGHT_UNIT_TOKENS: Record<WeightUnit, string> = { kg: "kg", lb: "lb" };

function validWeight(raw: string, u: WeightUnit): boolean {
  const n = parseNum(raw);
  if (n == null || n <= 0) return false;
  const kg = u === "kg" ? n : n / LB_PER_KG;
  return kg >= 20 && kg <= 300;
}

function validPace(raw: string, u: DistUnit): boolean {
  const s = parsePace(raw, u);
  return s != null && s >= 120 && s <= 1200;
}

const fmtKcal = (n: number) => Math.round(n).toLocaleString("en-US");

export default function RunningCaloriesCalculator() {
  const [weight, setWeight] = useState("70");
  const [wUnit, setWUnit] = useState<WeightUnit>("kg");
  const [mode, setMode] = useState<Mode>("distance");
  const [unit, setUnit] = useState<DistUnit>("km");
  const [distance, setDistance] = useState("10");
  const [duration, setDuration] = useState("1:00:00");
  const [pace, setPace] = useState("6:00");
  const [grade, setGrade] = useState("0");

  useUrlState({
    w: textField(weight, setWeight, "70", (r, params) =>
      validWeight(r, params ? tokenValue(params, "wu", WEIGHT_UNIT_TOKENS, "kg") : wUnit),
    ),
    wu: enumField(wUnit, setWUnit, "kg", WEIGHT_UNIT_TOKENS),
    m: enumField(mode, setMode, "distance", { distance: "dist", duration: "time" }),
    u: enumField(unit, setUnit, "km", DIST_UNIT_TOKENS),
    d: textField(distance, setDistance, "10", numIn(0, 1000, true), mode === "distance"),
    t: textField(duration, setDuration, "1:00:00", isDuration(24 * 3600), mode === "duration"),
    p: textField(pace, setPace, "6:00", (r, params) =>
      validPace(r, params ? tokenValue(params, "u", DIST_UNIT_TOKENS, "km") : unit),
    ),
    g: textField(grade, setGrade, "0", numIn(0, 30)),
  });

  const wN = parseNum(weight);
  const weightKg = wN != null && wN > 0 ? (wUnit === "kg" ? wN : wN / LB_PER_KG) : null;
  const weightErr =
    weightKg == null || weightKg < 20 || weightKg > 300
      ? wUnit === "kg"
        ? "Enter a body weight between 20 and 300 kg."
        : "Enter a body weight between 44 and 660 lb."
      : undefined;

  const dN = parseNum(distance);
  const distanceKm = dN != null && dN > 0 && dN <= 1000 ? (unit === "km" ? dN : milesToKm(dN)) : null;
  const distErr = mode === "distance" && distanceKm == null ? "Enter a distance greater than 0." : undefined;

  const durationSec = parseDuration(duration);
  const durErr =
    mode === "duration"
      ? (durationError(duration, "duration") ??
        (durationSec != null && durationSec > 24 * 3600 ? "Enter a duration up to 24 hours." : undefined))
      : undefined;

  const paceSec = parsePace(pace, unit);
  const paceErr =
    paceSec == null
      ? "Enter a pace like 6:00."
      : paceSec < 120 || paceSec > 1200
        ? "Enter a running pace between 2:00 and 20:00 per km (3:13–32:11 per mile)."
        : undefined;

  const gN = parseNum(grade);
  const gradeErr = gN == null || gN < 0 || gN > 30 ? "Enter an incline from 0 to 30%." : undefined;

  const result = useMemo(() => {
    if (weightErr || paceErr || gradeErr || weightKg == null || paceSec == null || gN == null) return null;
    if (mode === "distance") {
      if (distErr || distanceKm == null) return null;
      return runningCalories({ weightKg, distanceKm, paceSecPerKm: paceSec, gradePct: gN });
    }
    if (durErr || durationSec == null) return null;
    return runningCalories({ weightKg, durationSec, paceSecPerKm: paceSec, gradePct: gN });
  }, [mode, weightKg, distanceKm, durationSec, paceSec, gN, weightErr, paceErr, gradeErr, distErr, durErr]);

  const distLabel = (km: number) =>
    unit === "km" ? `${fmtNum(km, 2)} km` : `${fmtNum(kmToMiles(km), 2)} mi`;

  const summary = result
    ? [
        `Running energy estimate (Endurance Toolkit)`,
        `${distLabel(result.distanceKm)} in ${formatDuration(result.durationSec)} at ${fmtPace(result.paceSecPerKm, unit)}, ${fmtNum(result.gradePct, 1)}% incline, ${fmtNum(weightKg ?? 0, 1)} kg`,
        `ACSM gross: ${fmtKcal(result.grossKcal)} kcal (${fmtKcal(result.grossKcalPerHour)} kcal/h)`,
        `ACSM net (above resting): ${fmtKcal(result.netKcal)} kcal`,
        `Rule of thumb (1 kcal/kg/km): ${fmtKcal(result.ruleOfThumbKcal)} kcal`,
        "Estimates vary ±20% between individuals.",
      ].join("\n")
    : null;

  const rows = result
    ? [
        { k: "gross", name: "ACSM gross", kcal: result.grossKcal, note: "Total energy during the run, incl. resting" },
        { k: "net", name: "ACSM net", kcal: result.netKcal, note: "Extra energy above resting metabolism" },
        { k: "rot", name: "Rule of thumb", kcal: result.ruleOfThumbKcal, note: "1 kcal per kg per km, flat ground" },
      ]
    : [];

  function changeWeightUnit(u: WeightUnit) {
    const n = parseNum(weight);
    if (n != null && n > 0 && u !== wUnit) setWeight(fmtNum(u === "lb" ? n * LB_PER_KG : n / LB_PER_KG, 1).replace(/,/g, ""));
    setWUnit(u);
  }

  function changeUnit(u: DistUnit) {
    if (u === unit) return;
    const d = parseNum(distance);
    if (d != null && d > 0) {
      setDistance(fmtNum(u === "mile" ? kmToMiles(d) : milesToKm(d), 2).replace(/,/g, ""));
    }
    const p = parsePace(pace, unit);
    if (p != null) setPace(fmtPace(p, u, false));
    setUnit(u);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Your run">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <NumberInput
              label="Body weight"
              value={weight}
              onChange={setWeight}
              min={0}
              step="any"
              error={weightErr}
              className="min-w-32 flex-1"
            />
            <Segmented
              label="Weight unit"
              hideLabel
              value={wUnit}
              onChange={changeWeightUnit}
              options={[
                { value: "kg", label: "kg" },
                { value: "lb", label: "lb" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Segmented
              label="Enter the run as"
              value={mode}
              onChange={setMode}
              options={[
                { value: "distance", label: "Distance + pace" },
                { value: "duration", label: "Duration + pace" },
              ]}
            />
            <Segmented label="Distance unit" value={unit} onChange={changeUnit} options={UNIT_OPTIONS} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {mode === "distance" ? (
              <NumberInput
                label="Distance"
                value={distance}
                onChange={setDistance}
                min={0}
                step="any"
                suffix={unit === "km" ? "km" : "mi"}
                error={distErr}
              />
            ) : (
              <TextInput
                label="Duration"
                value={duration}
                onChange={setDuration}
                placeholder="h:mm:ss"
                hint="h:mm:ss or mm:ss"
                error={durErr}
              />
            )}
            <TextInput
              label="Average pace"
              value={pace}
              onChange={setPace}
              placeholder="mm:ss"
              suffix={paceSuffix(unit)}
              error={paceErr}
            />
            <NumberInput
              label="Incline"
              value={grade}
              onChange={setGrade}
              min={0}
              max={30}
              step={0.5}
              suffix="%"
              hint="Average uphill grade; 0 for flat or treadmill at 0%."
              error={gradeErr}
            />
          </div>
        </div>
      </Card>

      <Card title="Energy used" actions={
          <>
            <CopyButton text={summary} />
            <ShareButton />
          </>
        }>
        {result ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={3}>
              <ResultStat label="Gross energy" value={fmtKcal(result.grossKcal)} sub="kcal (ACSM)" emphasis />
              <ResultStat label="Net energy" value={fmtKcal(result.netKcal)} sub="kcal above resting" />
              <ResultStat label="Per hour" value={fmtKcal(result.grossKcalPerHour)} sub="kcal/h gross" />
            </StatGrid>
            <p className="text-sm text-muted">
              {distLabel(result.distanceKm)} · {formatDuration(result.durationSec)} · {fmtPace(result.paceSecPerKm, unit)} ·
              oxygen cost ≈ {fmtNum(result.vo2MlKgMin)} ml/kg/min
            </p>
            <ResultTable
              caption="Estimate by method"
              hideCaption
              rows={rows}
              rowKey={(r) => r.k}
              columns={[
                { key: "m", header: "Method", cell: (r) => r.name, rowHeader: true },
                { key: "k", header: "kcal", cell: (r) => fmtKcal(r.kcal), align: "right" },
                {
                  key: "pk",
                  header: unit === "km" ? "kcal/km" : "kcal/mi",
                  cell: (r) => fmtKcal(r.kcal / (unit === "km" ? result.distanceKm : kmToMiles(result.distanceKm))),
                  align: "right",
                },
                { key: "n", header: "What it measures", cell: (r) => <span className="text-muted">{r.note}</span> },
              ]}
            />
            {result.belowRunningSpeed && (
              <p role="note" className="rounded-lg bg-surface-2 p-3 text-sm text-warn">
                This pace is slower than about 8 km/h (7:28/km), below the range the ACSM running equation was built
                for. For walking or very easy jogging the estimate may run high.
              </p>
            )}
            <p className="text-xs text-muted">
              Estimates vary ±20%: running economy, terrain, wind, heat and body composition all change the real energy
              cost. Use the numbers to plan fueling and recovery around training, not as an exact measurement. Downhill
              running isn&apos;t modelled.
            </p>
          </div>
        ) : (
          <EmptyResult>Fix the highlighted fields to see your energy estimate.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
