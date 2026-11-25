"use client";

import { useMemo, useState } from "react";
import {
  formatPace,
  kmhToPace,
  mphToPacePerKm,
  pacePerKmToPerMile,
  paceToKmh,
  paceToMph,
} from "@/lib/calc";
import { Card, CopyButton, ResultStat, ResultTable, Select, StatGrid, TextInput } from "@/components/ui";
import { EmptyResult, fmtNum, parseNum, parsePace } from "./shared";

type ConvUnit = "minkm" | "minmile" | "kmh" | "mph";

const UNITS: ReadonlyArray<{ value: ConvUnit; label: string }> = [
  { value: "minkm", label: "min/km (pace)" },
  { value: "minmile", label: "min/mile (pace)" },
  { value: "kmh", label: "km/h (speed)" },
  { value: "mph", label: "mph (speed)" },
];

function toSecPerKm(input: string, unit: ConvUnit): number | null {
  if (unit === "minkm") return parsePace(input, "km");
  if (unit === "minmile") return parsePace(input, "mile");
  const n = parseNum(input);
  if (n == null || n <= 0) return null;
  return unit === "kmh" ? kmhToPace(n) : mphToPacePerKm(n);
}

function fromSecPerKm(sec: number, unit: ConvUnit): string {
  switch (unit) {
    case "minkm":
      return formatPace(sec);
    case "minmile":
      return formatPace(pacePerKmToPerMile(sec));
    case "kmh":
      return fmtNum(paceToKmh(sec), 2);
    case "mph":
      return fmtNum(paceToMph(sec), 2);
  }
}

/** 3:00 – 8:00 min/km in 15 s steps */
const CHART = Array.from({ length: 21 }, (_, i) => 180 + i * 15);

export default function PaceConverter() {
  const [value, setValue] = useState("5:00");
  const [unit, setUnit] = useState<ConvUnit>("minkm");

  /** Exact value behind an auto-converted (rounded) display string, so unit switches don't drift. */
  const [carried, setCarried] = useState<{ text: string; unit: ConvUnit; sec: number } | null>(null);

  const secPerKm = useMemo(
    () => (carried && carried.text === value && carried.unit === unit ? carried.sec : toSecPerKm(value, unit)),
    [value, unit, carried],
  );
  const isPace = unit === "minkm" || unit === "minmile";
  const error =
    secPerKm == null ? (isPace ? "Enter a pace like 5:00." : "Enter a speed greater than 0, e.g. 12.") : undefined;

  /** Switching units converts the current value so it stays equivalent. */
  function changeUnit(next: ConvUnit) {
    if (secPerKm != null) {
      const text = fromSecPerKm(secPerKm, next);
      setValue(text);
      setCarried({ text, unit: next, sec: secPerKm });
    } else {
      setValue(next === "minkm" || next === "minmile" ? "5:00" : "12");
      setCarried(null);
    }
    setUnit(next);
  }

  const nearest = secPerKm == null ? -1 : CHART.findIndex((s) => Math.abs(s - secPerKm) <= 7.5);

  const summary =
    secPerKm != null
      ? [
          "Pace conversion (Endurance Toolkit)",
          `${formatPace(secPerKm)} min/km`,
          `${formatPace(pacePerKmToPerMile(secPerKm))} min/mile`,
          `${fmtNum(paceToKmh(secPerKm), 2)} km/h`,
          `${fmtNum(paceToMph(secPerKm), 2)} mph`,
        ].join("\n")
      : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Convert">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Value"
            value={value}
            onChange={setValue}
            inputMode={isPace ? "text" : "decimal"}
            placeholder={isPace ? "m:ss" : "e.g. 12"}
            hint={isPace ? "Pace as m:ss" : "Speed as a number"}
            error={error}
          />
          <Select label="Unit" value={unit} onChange={changeUnit} options={UNITS} />
        </div>
      </Card>

      <Card title="Equivalents" actions={<CopyButton text={summary} />}>
        {secPerKm != null ? (
          <StatGrid cols={4}>
            <ResultStat label="Per km" value={formatPace(secPerKm)} sub="min/km" emphasis={unit === "minkm"} />
            <ResultStat
              label="Per mile"
              value={formatPace(pacePerKmToPerMile(secPerKm))}
              sub="min/mile"
              emphasis={unit === "minmile"}
            />
            <ResultStat label="Speed" value={fmtNum(paceToKmh(secPerKm), 2)} sub="km/h" emphasis={unit === "kmh"} />
            <ResultStat label="Speed" value={fmtNum(paceToMph(secPerKm), 2)} sub="mph" emphasis={unit === "mph"} />
          </StatGrid>
        ) : (
          <EmptyResult>Enter a pace or speed to convert.</EmptyResult>
        )}
      </Card>

      <Card title="Pace conversion chart">
        <ResultTable
          caption="Pace and treadmill speed chart, 3:00 to 8:00 min/km"
          hideCaption
          dense
          rows={CHART}
          rowKey={(s) => s}
          highlight={(_, i) => i === nearest}
          columns={[
            { key: "km", header: "min/km", cell: (s) => formatPace(s), rowHeader: true },
            { key: "mi", header: "min/mile", cell: (s) => formatPace(pacePerKmToPerMile(s)), align: "right" },
            { key: "kmh", header: "km/h", cell: (s) => fmtNum(paceToKmh(s), 1), align: "right" },
            { key: "mph", header: "mph", cell: (s) => fmtNum(paceToMph(s), 1), align: "right" },
          ]}
        />
      </Card>
    </div>
  );
}
