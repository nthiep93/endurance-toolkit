"use client";

import { useMemo, useState } from "react";
import {
  RACE_DISTANCES,
  formatDuration,
  parseDuration,
  raceTimeFromVdot,
  trainingPaces,
  vdotFromRace,
  type PaceRange,
  type TrainingPaces,
} from "@/lib/calc";
import { Card, CopyButton, ResultStat, ResultTable, ShareButton, StatGrid, TextInput } from "@/components/ui";
import {
  DistanceField,
  EmptyResult,
  UnitToggle,
  distanceLabel,
  distanceValue,
  durationError,
  fmtNum,
  fmtPace,
  resolveDistanceKm,
  type DistUnit,
} from "./shared";
import { DIST_UNIT_TOKENS, distanceField, enumField, isDuration, textField, useUrlState } from "./useUrlState";

const PACE_INFO: ReadonlyArray<{ key: keyof TrainingPaces; code: string; name: string; info: string; rep?: boolean }> = [
  { key: "easy", code: "E", name: "Easy", info: "Warm-ups, recovery and long runs. Conversational — builds aerobic base." },
  { key: "marathon", code: "M", name: "Marathon", info: "Goal marathon race pace; used in long steady segments." },
  { key: "threshold", code: "T", name: "Threshold", info: "Comfortably hard, ~1 hour race effort. Tempo runs and cruise intervals.", rep: true },
  { key: "interval", code: "I", name: "Interval", info: "Hard 3–5 min repeats near VO₂max with equal-ish recovery.", rep: true },
  { key: "repetition", code: "R", name: "Repetition", info: "Fast, short reps (200–400 m) for speed and economy; full recovery.", rep: true },
];

function fmtRange(r: PaceRange, unit: DistUnit): string {
  const a = fmtPace(r.minSecPerKm, unit, false);
  const b = fmtPace(r.maxSecPerKm, unit, false);
  return a === b ? a : `${a}–${b}`;
}

function fmt400(r: PaceRange): string {
  const a = formatDuration(r.minSecPerKm * 0.4);
  const b = formatDuration(r.maxSecPerKm * 0.4);
  return a === b ? a : `${a}–${b}`;
}

const EQUIV_IDS = ["5k", "10k", "half", "marathon"];

export default function VdotCalculator() {
  const [dist, setDist] = useState(distanceValue("5k"));
  const [time, setTime] = useState("25:00");
  const [unit, setUnit] = useState<DistUnit>("km");

  useUrlState({
    d: distanceField(dist, setDist, "5k"),
    t: textField(time, setTime, "25:00", isDuration()),
    u: enumField(unit, setUnit, "km", DIST_UNIT_TOKENS),
  });

  const km = resolveDistanceKm(dist);
  const timeErr = durationError(time, "race time");

  const { vdot, paces } = useMemo(() => {
    const t = parseDuration(time);
    if (!km || !t) return { vdot: null, paces: null };
    const v = vdotFromRace(km, t);
    return { vdot: v, paces: v != null ? trainingPaces(v) : null };
  }, [km, time]);

  const equivalents = useMemo(
    () =>
      vdot == null
        ? []
        : RACE_DISTANCES.filter((d) => EQUIV_IDS.includes(d.id)).map((d) => ({ d, sec: raceTimeFromVdot(vdot, d.km) })),
    [vdot],
  );

  const outOfRange = !timeErr && km != null && vdot == null;

  const summary =
    vdot != null && paces
      ? [
          `VDOT ${fmtNum(vdot)} from ${distanceLabel(dist)} in ${time.trim()} (Endurance Toolkit)`,
          ...PACE_INFO.map((p) => `${p.code} – ${p.name}: ${fmtRange(paces[p.key], unit)} min/${unit === "km" ? "km" : "mi"}`),
          ...equivalents.map((e) => `${e.d.label} equivalent: ${e.sec != null ? formatDuration(e.sec) : "—"}`),
        ].join("\n")
      : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Recent race">
        <div className="grid gap-4 sm:grid-cols-2">
          <DistanceField label="Race distance" value={dist} onChange={setDist} allPresets />
          <TextInput
            label="Finish time"
            value={time}
            onChange={setTime}
            placeholder="h:mm:ss"
            hint="h:mm:ss or mm:ss"
            error={timeErr}
          />
        </div>
      </Card>

      <Card
        title="Your VDOT & training paces"
        actions={
          <>
            <UnitToggle value={unit} onChange={setUnit} />
            <CopyButton text={summary} />
            <ShareButton />
          </>
        }
      >
        {vdot != null && paces ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={2}>
              <ResultStat label="VDOT" value={fmtNum(vdot)} sub="Daniels running fitness score" emphasis />
              <ResultStat
                label="Threshold pace"
                value={fmtRange(paces.threshold, unit)}
                sub={unit === "km" ? "min/km" : "min/mile"}
              />
            </StatGrid>
            <ResultTable
              caption="Training paces"
              hideCaption
              rows={PACE_INFO}
              rowKey={(p) => p.key}
              columns={[
                {
                  key: "n",
                  header: "Type",
                  rowHeader: true,
                  cell: (p) => (
                    <span>
                      <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand text-xs font-bold text-brand-fg">
                        {p.code}
                      </span>
                      {p.name}
                    </span>
                  ),
                },
                {
                  key: "p",
                  header: unit === "km" ? "Pace /km" : "Pace /mile",
                  cell: (p) => fmtRange(paces[p.key], unit),
                  align: "right",
                },
                { key: "q", header: "Per 400 m", cell: (p) => (p.rep ? fmt400(paces[p.key]) : "—"), align: "right" },
              ]}
            />
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {PACE_INFO.map((p) => (
                <div key={p.key} className="rounded-lg bg-surface-2 p-3">
                  <dt className="font-semibold text-fg">
                    {p.code} · {p.name}
                  </dt>
                  <dd className="text-muted">{p.info}</dd>
                </div>
              ))}
            </dl>
            <ResultTable
              caption="Equivalent race times for this VDOT"
              rows={equivalents}
              rowKey={(e) => e.d.id}
              columns={[
                { key: "d", header: "Race", cell: (e) => e.d.label, rowHeader: true },
                { key: "t", header: "Equivalent time", cell: (e) => (e.sec != null ? formatDuration(e.sec) : "—"), align: "right" },
              ]}
            />
          </div>
        ) : (
          <EmptyResult>
            {outOfRange
              ? "VDOT works for races of roughly 1.5–50 km lasting 3.5 minutes to 5 hours. Check your distance and time."
              : "Enter a recent race distance and time to see your VDOT."}
          </EmptyResult>
        )}
      </Card>
    </div>
  );
}
