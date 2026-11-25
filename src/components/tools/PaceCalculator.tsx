"use client";

import { useMemo, useState } from "react";
import { RACE_DISTANCES, formatDuration, kmToMiles, parseDuration, solvePace } from "@/lib/calc";
import { Card, CopyButton, ResultStat, ResultTable, Segmented, StatGrid, TextInput } from "@/components/ui";
import {
  DistanceField,
  EmptyResult,
  UnitToggle,
  distanceValue,
  durationError,
  fmtDistNum,
  fmtNum,
  fmtPace,
  implausibleTimeWarning,
  paceSuffix,
  parsePace,
  resolveDistanceKm,
  type DistUnit,
} from "./shared";

type Solve = "pace" | "time" | "distance";

export default function PaceCalculator() {
  const [solve, setSolve] = useState<Solve>("pace");
  const [dist, setDist] = useState(distanceValue("marathon"));
  const [time, setTime] = useState("4:00:00");
  const [pace, setPace] = useState("5:41");
  const [unit, setUnit] = useState<DistUnit>("km");

  const distanceKm = resolveDistanceKm(dist);
  const timeErr =
    solve !== "time"
      ? (durationError(time, "finish time") ??
        (solve === "pace" ? implausibleTimeWarning(parseDuration(time), distanceKm) : undefined))
      : undefined;
  const paceErr =
    solve !== "pace" ? (parsePace(pace, unit) == null ? "Enter a pace like 5:30." : undefined) : undefined;

  const result = useMemo(() => {
    const t = parseDuration(time);
    const p = parsePace(pace, unit);
    if (solve === "pace") return distanceKm && t ? solvePace({ distanceKm, timeSec: t }) : null;
    if (solve === "time") return distanceKm && p ? solvePace({ distanceKm, paceSecPerKm: p }) : null;
    return t && p ? solvePace({ timeSec: t, paceSecPerKm: p }) : null;
  }, [solve, distanceKm, time, pace, unit]);

  const raceRows = useMemo(
    () =>
      result
        ? RACE_DISTANCES.filter((d) => ["5k", "10k", "half", "marathon"].includes(d.id)).map((d) => ({
            d,
            sec: d.km * result.paceSecPerKm,
          }))
        : [],
    [result],
  );

  const summary = result
    ? [
        "Running pace calculation (Endurance Toolkit)",
        `Distance: ${fmtDistNum(result.distanceKm)} km (${fmtNum(kmToMiles(result.distanceKm), 2)} mi)`,
        `Time: ${formatDuration(result.timeSec)}`,
        `Pace: ${fmtPace(result.paceSecPerKm, "km")} | ${fmtPace(result.paceSecPerKm, "mile")}`,
        `Speed: ${fmtNum(result.speedKmh)} km/h | ${fmtNum(result.speedMph)} mph`,
      ].join("\n")
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Your run">
        <div className="flex flex-col gap-4">
          <Segmented
            label="What do you want to calculate?"
            value={solve}
            onChange={setSolve}
            options={[
              { value: "pace", label: "Pace" },
              { value: "time", label: "Finish time" },
              { value: "distance", label: "Distance" },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {solve !== "distance" && <DistanceField value={dist} onChange={setDist} allPresets />}
            {solve !== "time" && (
              <TextInput
                label="Time"
                value={time}
                onChange={setTime}
                placeholder="h:mm:ss"
                hint="h:mm:ss or mm:ss"
                error={timeErr}
              />
            )}
            {solve !== "pace" && (
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
          </div>
        </div>
      </Card>

      <Card
        title="Result"
        actions={
          <>
            {solve === "pace" && <UnitToggle value={unit} onChange={setUnit} />}
            <CopyButton text={summary} />
          </>
        }
      >
        {result ? (
          <div className="flex flex-col gap-4" aria-live="polite">
            <StatGrid cols={4}>
              <ResultStat
                label="Pace"
                value={fmtPace(result.paceSecPerKm, unit, false)}
                sub={`min${paceSuffix(unit)} · ${fmtPace(result.paceSecPerKm, unit === "km" ? "mile" : "km")}`}
                emphasis={solve === "pace"}
              />
              <ResultStat
                label="Time"
                value={formatDuration(result.timeSec)}
                sub="h:mm:ss"
                emphasis={solve === "time"}
              />
              <ResultStat
                label="Distance"
                value={fmtDistNum(result.distanceKm)}
                sub={`km · ${fmtNum(kmToMiles(result.distanceKm), 2)} mi`}
                emphasis={solve === "distance"}
              />
              <ResultStat label="Speed" value={fmtNum(result.speedKmh)} sub={`km/h · ${fmtNum(result.speedMph)} mph`} />
            </StatGrid>
            <ResultTable
              caption="Finish times at this pace"
              rows={raceRows}
              rowKey={(r) => r.d.id}
              columns={[
                { key: "d", header: "Race", cell: (r) => r.d.label, rowHeader: true },
                { key: "t", header: "Finish time", cell: (r) => formatDuration(r.sec), align: "right" },
              ]}
            />
          </div>
        ) : (
          <EmptyResult>Fill in the fields above to see your result.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
