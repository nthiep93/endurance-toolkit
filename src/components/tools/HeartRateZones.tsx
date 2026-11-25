"use client";

import { useMemo, useState } from "react";
import { estimateMaxHr, karvonenZones, percentMaxZones, type HrZone, type MaxHrFormula } from "@/lib/calc";
import { Card, CopyButton, NumberInput, ResultStat, ResultTable, Segmented, Select, ShareButton, StatGrid, cx } from "@/components/ui";
import { EmptyResult, parseNum } from "./shared";
import { enumField, numIn, textField, useUrlState } from "./useUrlState";

type MaxSource = "age" | "known";
type Method = "karvonen" | "percent";

const FORMULAS: ReadonlyArray<{ value: MaxHrFormula; label: string }> = [
  { value: "tanaka", label: "Tanaka: 208 − 0.7 × age" },
  { value: "gellish", label: "Gellish: 207 − 0.7 × age" },
  { value: "fox", label: "Fox: 220 − age" },
];

/** Token-only zone colors, easy → hard. */
const ZONE_BAR: Record<HrZone["zone"], string> = {
  1: "bg-muted",
  2: "bg-good",
  3: "bg-accent",
  4: "bg-warn",
  5: "bg-brand",
};

function intOrNull(s: string, min: number, max: number): number | null {
  const n = parseNum(s);
  return n != null && n >= min && n <= max ? n : null;
}

export default function HeartRateZones() {
  const [source, setSource] = useState<MaxSource>("age");
  const [age, setAge] = useState("35");
  const [formula, setFormula] = useState<MaxHrFormula>("tanaka");
  const [knownMax, setKnownMax] = useState("185");
  const [rest, setRest] = useState("55");
  const [method, setMethod] = useState<Method>("karvonen");

  useUrlState({
    s: enumField(source, setSource, "age", { age: "age", known: "max" }),
    a: textField(age, setAge, "35", numIn(10, 100), source === "age"),
    f: enumField(formula, setFormula, "tanaka", { tanaka: "tanaka", gellish: "gellish", fox: "fox" }, source === "age"),
    mx: textField(knownMax, setKnownMax, "185", numIn(100, 230), source === "known"),
    r: textField(rest, setRest, "55", numIn(30, 110), method === "karvonen"),
    m: enumField(method, setMethod, "karvonen", { karvonen: "hrr", percent: "pct" }),
  });

  const ageN = intOrNull(age, 10, 100);
  const knownN = intOrNull(knownMax, 100, 230);
  const restN = intOrNull(rest, 30, 110);

  const maxHr = source === "age" ? (ageN != null ? estimateMaxHr(ageN, formula) : null) : knownN;

  const ageErr = source === "age" && ageN == null ? "Enter an age between 10 and 100." : undefined;
  const maxErr = source === "known" && knownN == null ? "Enter a max heart rate between 100 and 230 bpm." : undefined;
  const restErr =
    method === "karvonen"
      ? restN == null
        ? "Enter a resting heart rate between 30 and 110 bpm."
        : maxHr != null && restN >= maxHr
          ? "Resting HR must be below max HR."
          : undefined
      : undefined;

  const zones = useMemo(() => {
    if (maxHr == null) return null;
    if (method === "percent") return percentMaxZones(maxHr);
    if (restN == null || restN >= maxHr) return null;
    return karvonenZones(maxHr, restN);
  }, [maxHr, restN, method]);

  const floor = zones ? zones[0].minBpm : 0;
  const span = zones && maxHr ? Math.max(1, maxHr - floor) : 1;

  const summary =
    zones && maxHr
      ? [
          `Heart rate zones – ${method === "karvonen" ? `Karvonen (rest ${restN} bpm)` : "% of max HR"}, max ${Math.round(maxHr)} bpm (Endurance Toolkit)`,
          ...zones.map((z) => `Z${z.zone} ${z.name}: ${z.minBpm}–${z.maxBpm} bpm (${z.minPct}–${z.maxPct}%)`),
        ].join("\n")
      : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Your heart rate">
        <div className="flex flex-col gap-4">
          <Segmented
            label="Max heart rate"
            value={source}
            onChange={setSource}
            options={[
              { value: "age", label: "Estimate from age" },
              { value: "known", label: "I know my max" },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {source === "age" ? (
              <>
                <NumberInput label="Age" value={age} onChange={setAge} min={10} max={100} step={1} inputMode="numeric" suffix="years" error={ageErr} />
                <Select label="Max HR formula" value={formula} onChange={setFormula} options={FORMULAS} />
              </>
            ) : (
              <NumberInput
                label="Max heart rate"
                value={knownMax}
                onChange={setKnownMax}
                min={100}
                max={230}
                step={1}
                inputMode="numeric"
                suffix="bpm"
                hint="From a recent all-out effort or lab test."
                error={maxErr}
              />
            )}
            <NumberInput
              label="Resting heart rate"
              value={rest}
              onChange={setRest}
              min={30}
              max={110}
              step={1}
              inputMode="numeric"
              suffix="bpm"
              hint={
                method === "karvonen"
                  ? "Measure on waking, before getting up."
                  : "Not used by the % of max HR method — only by Karvonen."
              }
              error={restErr}
            />
          </div>
          <Segmented
            label="Zone method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "karvonen", label: "Karvonen (HR reserve)" },
              { value: "percent", label: "% of max HR" },
            ]}
          />
        </div>
      </Card>

      <Card title="Your zones" actions={
          <>
            <CopyButton text={summary} />
            <ShareButton />
          </>
        }>
        {zones && maxHr ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={method === "karvonen" ? 3 : 2}>
              <ResultStat label="Max HR" value={Math.round(maxHr)} sub={source === "age" ? "bpm (estimated)" : "bpm"} emphasis />
              {method === "karvonen" && restN != null && (
                <ResultStat label="HR reserve" value={Math.round(maxHr - restN)} sub="bpm (max − rest)" />
              )}
              <ResultStat label="Zone 2" value={`${zones[1].minBpm}–${zones[1].maxBpm}`} sub="bpm · easy aerobic" />
            </StatGrid>
            <ResultTable
              caption="Heart rate training zones"
              hideCaption
              rows={zones}
              rowKey={(z) => z.zone}
              columns={[
                {
                  key: "z",
                  header: "Zone",
                  rowHeader: true,
                  cell: (z) => (
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true" className={cx("h-3 w-3 shrink-0 rounded-sm", ZONE_BAR[z.zone])} />
                      Z{z.zone} {z.name}
                    </span>
                  ),
                },
                { key: "b", header: "BPM", cell: (z) => `${z.minBpm}–${z.maxBpm}`, align: "right" },
                { key: "p", header: method === "karvonen" ? "% HRR" : "% max", cell: (z) => `${z.minPct}–${z.maxPct}%`, align: "right" },
                {
                  key: "bar",
                  header: <span className="sr-only">Range chart</span>,
                  className: "w-full min-w-28",
                  cell: (z) => (
                    <div className="relative h-3 w-full rounded-full bg-surface-2" aria-hidden="true">
                      <div
                        className={cx("absolute inset-y-0 rounded-full", ZONE_BAR[z.zone])}
                        style={{
                          left: `${((z.minBpm - floor) / span) * 100}%`,
                          width: `${Math.max(2, ((z.maxBpm - z.minBpm) / span) * 100)}%`,
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {zones.map((z) => (
                <li key={z.zone} className="flex gap-2 rounded-lg bg-surface-2 p-3">
                  <span aria-hidden="true" className={cx("mt-1 h-3 w-3 shrink-0 rounded-sm", ZONE_BAR[z.zone])} />
                  <span>
                    <span className="font-semibold text-fg">
                      Z{z.zone} {z.name}:
                    </span>{" "}
                    <span className="text-muted">{z.purpose}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted">
              Age formulas are population averages and can be off by 10+ bpm. A field test gives a more accurate max HR.
            </p>
          </div>
        ) : (
          <EmptyResult>Fix the highlighted fields to see your zones.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
