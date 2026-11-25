"use client";

import { useMemo, useState } from "react";
import { formatDuration, fuelingPlan, parseDuration } from "@/lib/calc";
import { Card, CopyButton, NumberInput, RangeInput, ResultStat, StatGrid, TextInput } from "@/components/ui";
import { EmptyResult, durationError, fmtHM, fmtNum, parseNum } from "./shared";

export default function RaceFuelingCalculator() {
  const [time, setTime] = useState("4:00:00");
  const [carbs, setCarbs] = useState(60);
  const [gelG, setGelG] = useState("25");
  const [fluid, setFluid] = useState("500");

  const timeErr = durationError(time, "finish time");
  const gelN = parseNum(gelG);
  const fluidN = parseNum(fluid);
  const gelErr = gelN == null || gelN <= 0 || gelN > 200 ? "Enter grams of carbs per gel (e.g. 22–40)." : undefined;
  const fluidErr = fluidN == null || fluidN <= 0 || fluidN > 3000 ? "Enter ml per hour (typically 400–800)." : undefined;

  const durationSec = parseDuration(time);

  const plan = useMemo(() => {
    if (!durationSec || gelErr || fluidErr) return null;
    return fuelingPlan({ durationSec, carbsPerHour: carbs, gelCarbsG: gelN ?? 25, fluidMlPerHour: fluidN ?? 500 });
  }, [durationSec, carbs, gelN, fluidN, gelErr, fluidErr]);

  const hours = durationSec ? durationSec / 3600 : 0;
  const sodiumTotal = plan ? Math.round(plan.sodiumMgPerHour * hours) : 0;

  const summary = plan
    ? [
        `Race fueling plan for ${formatDuration(durationSec ?? 0)} (Endurance Toolkit)`,
        `Carbs: ${plan.carbsPerHour} g/h → ${plan.gels} gels × ${gelN} g = ${plan.totalCarbsG} g`,
        `Fluid: ${plan.fluidMlPerHour} ml/h → ~${fmtNum(plan.totalFluidMl / 1000)} L total`,
        `Sodium: ~${plan.sodiumMgPerHour} mg/h → ~${sodiumTotal} mg total`,
        ...plan.gelSchedule.map((m, i) => `${fmtHM(m)} – gel #${i + 1}`),
        "Needs vary — practice your plan in training.",
      ].join("\n")
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Race details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Expected finish time"
            value={time}
            onChange={setTime}
            placeholder="h:mm:ss"
            hint="h:mm:ss or mm:ss"
            error={timeErr}
          />
          <RangeInput
            label="Carbs per hour"
            value={carbs}
            onChange={setCarbs}
            min={30}
            max={90}
            step={5}
            valueLabel={`${carbs} g/h`}
            hint="30–60 g/h is common; 90 g/h needs a trained gut."
          />
          <NumberInput label="Carbs per gel" value={gelG} onChange={setGelG} min={1} max={200} step={1} suffix="g" error={gelErr} />
          <NumberInput
            label="Fluid per hour"
            value={fluid}
            onChange={setFluid}
            min={0}
            max={3000}
            step={50}
            suffix="ml/h"
            hint="Adjust for heat and sweat rate."
            error={fluidErr}
          />
        </div>
      </Card>

      <Card title="Your fueling plan" actions={<CopyButton text={summary} />}>
        {plan ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={4}>
              <ResultStat label="Gels" value={plan.gels} sub={`${gelN} g each`} emphasis />
              <ResultStat label="Carbs from gels" value={`${plan.totalCarbsG} g`} sub={`target ${plan.carbsPerHour} g/h`} />
              <ResultStat label="Fluid" value={`${fmtNum(plan.totalFluidMl / 1000)} L`} sub={`${plan.fluidMlPerHour} ml/h`} />
              <ResultStat label="Sodium" value={`${sodiumTotal} mg`} sub={`~${plan.sodiumMgPerHour} mg/h`} />
            </StatGrid>
            {plan.gels > 0 ? (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-fg">
                  Gel schedule <span className="font-normal text-muted">(h:mm from start, every ~{fmtNum(plan.gelIntervalMin, 0)} min)</span>
                </h3>
                <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {plan.gelSchedule.map((m, i) => (
                    <li key={m} className="tabular rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm">
                      <span className="font-semibold text-fg">{fmtHM(m)}</span>
                      <span className="text-muted"> – gel #{i + 1}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-sm text-muted">
                For efforts under about an hour, most runners don&apos;t need gels — water and a good pre-race meal are
                usually enough.
              </p>
            )}
            <p className="text-xs text-muted">
              Needs vary by body size, intensity and conditions. Practice your fueling in training — never try anything
              new on race day.
            </p>
          </div>
        ) : (
          <EmptyResult>Fix the highlighted fields to see your plan.</EmptyResult>
        )}
      </Card>
    </div>
  );
}
