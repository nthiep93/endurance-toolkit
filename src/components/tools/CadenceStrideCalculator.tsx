"use client";

import { useMemo, useState } from "react";
import { cadenceForPace, paceFromCadenceStride, strideLengthM } from "@/lib/calc";
import { Card, CopyButton, NumberInput, ResultStat, Segmented, StatGrid, TextInput } from "@/components/ui";
import { EmptyResult, UnitToggle, fmtNum, fmtPace, paceSuffix, parseNum, parsePace, type DistUnit } from "./shared";

type Mode = "stride" | "cadence" | "pace";

const FT_PER_M = 3.28084;

export default function CadenceStrideCalculator() {
  const [mode, setMode] = useState<Mode>("stride");
  const [pace, setPace] = useState("5:30");
  const [unit, setUnit] = useState<DistUnit>("km");
  const [cadence, setCadence] = useState("170");
  const [stride, setStride] = useState("1.07");

  const paceN = parsePace(pace, unit);
  const cadN = parseNum(cadence);
  const strN = parseNum(stride);
  const cadValid = cadN != null && cadN >= 100 && cadN <= 250;
  const strValid = strN != null && strN > 0.3 && strN <= 3;

  const paceErr = mode !== "pace" && paceN == null ? "Enter a pace like 5:30." : undefined;
  const cadErr = mode !== "cadence" && !cadValid ? "Enter 100–250 steps/min." : undefined;
  const strErr = mode !== "stride" && !strValid ? "Enter a stride length between 0.3 and 3 m." : undefined;

  const result = useMemo(() => {
    if (mode === "stride") {
      if (paceN == null || !cadValid) return null;
      const s = strideLengthM(paceN, cadN!);
      return s == null ? null : { pace: paceN, cadence: cadN!, stride: s };
    }
    if (mode === "cadence") {
      if (paceN == null || !strValid) return null;
      const c = cadenceForPace(paceN, strN!);
      return c == null ? null : { pace: paceN, cadence: c, stride: strN! };
    }
    if (!cadValid || !strValid) return null;
    const p = paceFromCadenceStride(cadN!, strN!);
    return p == null ? null : { pace: p, cadence: cadN!, stride: strN! };
  }, [mode, paceN, cadN, strN, cadValid, strValid]);

  const summary = result
    ? [
        "Cadence & stride (Endurance Toolkit)",
        `Pace: ${fmtPace(result.pace, "km")} | ${fmtPace(result.pace, "mile")}`,
        `Cadence: ${Math.round(result.cadence)} steps/min`,
        `Stride length: ${fmtNum(result.stride, 2)} m (${fmtNum(result.stride * FT_PER_M, 1)} ft)`,
        `Steps per km: ${Math.round(1000 / result.stride)}`,
      ].join("\n")
    : null;

  const otherUnit: DistUnit = unit === "km" ? "mile" : "km";

  return (
    <div className="flex flex-col gap-4">
      <Card title="Your running form">
        <div className="flex flex-col gap-4">
          <Segmented
            label="What do you want to calculate?"
            value={mode}
            onChange={setMode}
            options={[
              { value: "stride", label: "Stride length" },
              { value: "cadence", label: "Cadence" },
              { value: "pace", label: "Pace" },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {mode !== "pace" && (
              <div className="flex flex-col gap-2">
                <TextInput
                  label={`Pace (min${paceSuffix(unit)})`}
                  value={pace}
                  onChange={setPace}
                  placeholder="m:ss"
                  suffix={paceSuffix(unit)}
                  error={paceErr}
                />
                <UnitToggle value={unit} onChange={setUnit} label="Pace input unit" />
              </div>
            )}
            {mode !== "cadence" && (
              <NumberInput
                label="Cadence"
                value={cadence}
                onChange={setCadence}
                min={100}
                max={250}
                step={1}
                inputMode="numeric"
                suffix="spm"
                hint="Steps per minute (both feet)."
                error={cadErr}
              />
            )}
            {mode !== "stride" && (
              <NumberInput
                label="Stride length"
                value={stride}
                onChange={setStride}
                min={0.3}
                max={3}
                step={0.01}
                suffix="m"
                hint="Distance per step, in metres."
                error={strErr}
              />
            )}
          </div>
        </div>
      </Card>

      <Card
        title="Result"
        actions={
          <>
            {mode === "pace" && <UnitToggle value={unit} onChange={setUnit} />}
            <CopyButton text={summary} />
          </>
        }
      >
        {result ? (
          <StatGrid cols={4}>
            <ResultStat
              label="Stride length"
              value={`${fmtNum(result.stride, 2)} m`}
              sub={`${fmtNum(result.stride * 100, 0)} cm · ${fmtNum(result.stride * FT_PER_M, 1)} ft`}
              emphasis={mode === "stride"}
            />
            <ResultStat
              label="Cadence"
              value={Math.round(result.cadence)}
              sub="steps/min"
              emphasis={mode === "cadence"}
            />
            <ResultStat
              label="Pace"
              value={fmtPace(result.pace, unit, false)}
              sub={`min${paceSuffix(unit)} · ${fmtPace(result.pace, otherUnit)}`}
              emphasis={mode === "pace"}
            />
            <ResultStat label="Steps per km" value={Math.round(1000 / result.stride)} sub="at this stride" />
          </StatGrid>
        ) : (
          <EmptyResult>Fix the highlighted fields to see your result.</EmptyResult>
        )}
        <p className="mt-4 text-xs text-muted">
          Stride length here is the distance of one step (one foot to the other). Most runners naturally sit around
          160–185 spm; small cadence increases (5–10%) can reduce overstriding.
        </p>
      </Card>
    </div>
  );
}
