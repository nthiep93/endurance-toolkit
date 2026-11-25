"use client";

import { useMemo, useState } from "react";
import { formatDuration, parseDuration, splitPlan } from "@/lib/calc";
import {
  Button,
  Card,
  CopyButton,
  NumberInput,
  ResultStat,
  ResultTable,
  Segmented,
  StatGrid,
  TextInput,
} from "@/components/ui";
import {
  DistanceField,
  EmptyResult,
  UNIT_OPTIONS,
  distanceLabel,
  distanceValue,
  durationError,
  fmtPace,
  parseNum,
  resolveDistanceKm,
  type DistUnit,
} from "./shared";

type Strategy = "even" | "negative";

export default function MarathonSplits() {
  const [dist, setDist] = useState(distanceValue("marathon"));
  const [goal, setGoal] = useState("4:00:00");
  const [unit, setUnit] = useState<DistUnit>("km");
  const [strategy, setStrategy] = useState<Strategy>("even");
  const [neg, setNeg] = useState("2");

  const km = resolveDistanceKm(dist);
  const goalErr = durationError(goal, "goal time");
  const negN = parseNum(neg);
  const negErr = strategy === "negative" && (negN == null || negN < 0 || negN > 20) ? "Enter 0–20 %." : undefined;

  const rows = useMemo(() => {
    const t = parseDuration(goal);
    if (!km || !t) return null;
    if (strategy === "negative" && (negN == null || negN < 0 || negN > 20)) return null;
    return splitPlan({ distanceKm: km, targetSec: t, unit, strategy, negativePct: negN ?? 0 });
  }, [km, goal, unit, strategy, negN]);

  const total = rows?.length ? rows[rows.length - 1].cumulativeSec : 0;
  const avgPace = rows && km ? total / km : 0;
  const halfway = useMemo(() => {
    if (!rows || !km) return null;
    // time at the halfway distance, interpolated within the straddling split
    let d = 0;
    for (const r of rows) {
      if (d + r.distanceKm >= km / 2) return r.cumulativeSec - r.splitSec + (km / 2 - d) * r.paceSecPerKm;
      d += r.distanceKm;
    }
    return null;
  }, [rows, km]);

  const title = `${distanceLabel(dist)} · ${formatDuration(total)} · ${strategy === "even" ? "even" : `${negN}% negative`} split`;

  const summary = rows
    ? [
        `Pace plan: ${title} (Endurance Toolkit)`,
        `Average pace: ${fmtPace(avgPace, unit)}`,
        ...rows.map((r) => `${r.label}: ${formatDuration(r.splitSec)} (${fmtPace(r.paceSecPerKm, unit)}) – total ${formatDuration(r.cumulativeSec)}`),
      ].join("\n")
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Race plan" className="no-print">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <DistanceField label="Race distance" value={dist} onChange={setDist} allPresets />
            <TextInput
              label="Goal time"
              value={goal}
              onChange={setGoal}
              placeholder="h:mm:ss"
              hint="h:mm:ss or mm:ss"
              error={goalErr}
            />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <Segmented label="Split every" value={unit} onChange={setUnit} options={UNIT_OPTIONS} />
            <Segmented
              label="Pacing strategy"
              value={strategy}
              onChange={setStrategy}
              options={[
                { value: "even", label: "Even" },
                { value: "negative", label: "Negative split" },
              ]}
            />
            {strategy === "negative" && (
              <NumberInput
                label="Second half faster by"
                value={neg}
                onChange={setNeg}
                min={0}
                max={20}
                step={0.5}
                suffix="%"
                error={negErr}
                className="w-44"
              />
            )}
          </div>
        </div>
      </Card>

      <Card
        title="Your splits"
        actions={
          <span className="no-print flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={() => window.print()} disabled={!rows}>
              Print pace band
            </Button>
            <CopyButton text={summary} />
          </span>
        }
      >
        {rows ? (
          <div className="flex flex-col gap-4">
            <StatGrid className="no-print">
              <ResultStat label="Finish" value={formatDuration(total)} emphasis />
              <ResultStat label="Average pace" value={fmtPace(avgPace, unit, false)} sub={unit === "km" ? "min/km" : "min/mile"} />
              <ResultStat label="Halfway" value={halfway != null ? formatDuration(halfway) : "—"} sub="time at half distance" />
            </StatGrid>
            <div className="print-area">
              <p className="mb-2 text-sm font-semibold text-fg">{title}</p>
              <ResultTable
                caption={`Split plan, ${title}`}
                hideCaption
                dense
                rows={rows}
                rowKey={(r) => r.index}
                columns={[
                  { key: "l", header: unit === "km" ? "Km" : "Mile", cell: (r) => r.label, rowHeader: true },
                  { key: "s", header: "Split", cell: (r) => formatDuration(r.splitSec), align: "right" },
                  {
                    key: "p",
                    header: unit === "km" ? "Pace /km" : "Pace /mi",
                    cell: (r) => fmtPace(r.paceSecPerKm, unit, false),
                    align: "right",
                  },
                  { key: "c", header: "Total", cell: (r) => formatDuration(r.cumulativeSec), align: "right" },
                ]}
              />
            </div>
          </div>
        ) : (
          <EmptyResult>Enter a distance and goal time to build your split plan.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
