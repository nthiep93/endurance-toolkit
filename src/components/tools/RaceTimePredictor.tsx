"use client";

import { useMemo, useState } from "react";
import { formatDuration, parseDuration, predictAll, vdotFromRace } from "@/lib/calc";
import { Card, CopyButton, ResultStat, ResultTable, StatGrid, TextInput } from "@/components/ui";
import {
  DistanceField,
  EmptyResult,
  UnitToggle,
  distanceLabel,
  distanceValue,
  durationError,
  fmtNum,
  fmtPace,
  implausibleTimeWarning,
  resolveDistanceKm,
  type DistUnit,
} from "./shared";

export default function RaceTimePredictor() {
  const [dist, setDist] = useState(distanceValue("10k"));
  const [time, setTime] = useState("50:00");
  const [unit, setUnit] = useState<DistUnit>("km");

  const fromKm = resolveDistanceKm(dist);
  const timeErr = durationError(time, "race time") ?? implausibleTimeWarning(parseDuration(time), fromKm);

  const { predictions, vdot } = useMemo(() => {
    const t = parseDuration(time);
    if (!fromKm || !t) return { predictions: [], vdot: null };
    return { predictions: predictAll(t, fromKm), vdot: vdotFromRace(fromKm, t) };
  }, [fromKm, time]);

  const sourceId = dist.preset;

  const summary = predictions.length
    ? [
        `Race time predictions from ${distanceLabel(dist)} in ${time.trim()} (Endurance Toolkit)`,
        vdot != null ? `VDOT: ${fmtNum(vdot)}` : null,
        ...predictions.map(
          (p) =>
            `${p.distance.label}: ${formatDuration(p.riegelSec)} (Riegel)` +
            (p.vdotSec != null ? ` / ${formatDuration(p.vdotSec)} (VDOT)` : "") +
            ` – ${fmtPace(p.paceSecPerKm, unit)}`,
        ),
      ]
        .filter(Boolean)
        .join("\n")
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
        title="Predicted times"
        actions={
          <>
            <UnitToggle value={unit} onChange={setUnit} />
            <CopyButton text={summary} />
          </>
        }
      >
        {predictions.length ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={2}>
              <ResultStat
                label="Marathon (Riegel)"
                value={formatDuration(predictions.find((p) => p.distance.id === "marathon")?.riegelSec ?? 0)}
                emphasis
              />
              <ResultStat label="VDOT" value={vdot != null ? fmtNum(vdot) : "—"} sub="Daniels running fitness" />
            </StatGrid>
            <ResultTable
              caption="Predicted finish times"
              hideCaption
              rows={predictions}
              rowKey={(p) => p.distance.id}
              highlight={(p) => p.distance.id === sourceId}
              columns={[
                { key: "d", header: "Distance", cell: (p) => p.distance.label, rowHeader: true },
                { key: "r", header: "Riegel", cell: (p) => formatDuration(p.riegelSec), align: "right" },
                {
                  key: "v",
                  header: "VDOT",
                  cell: (p) => (p.vdotSec != null ? formatDuration(p.vdotSec) : "—"),
                  align: "right",
                },
                {
                  key: "p",
                  header: `Pace (${unit === "km" ? "min/km" : "min/mi"})`,
                  cell: (p) => fmtPace(p.paceSecPerKm, unit, false),
                  align: "right",
                },
              ]}
            />
            <p className="text-xs text-muted">
              Pace is based on the Riegel prediction. Predictions assume equal training for the target distance — longer
              races need the endurance to back them up. VDOT shows “—” outside its valid range (about 1.5–50 km).
            </p>
          </div>
        ) : (
          <EmptyResult>Enter a recent race distance and time to see predictions.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
