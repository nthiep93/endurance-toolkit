"use client";

import { useMemo, useState } from "react";
import {
  RACE_DISTANCES,
  VO2MAX_NORMS,
  cooperVo2max,
  formatDuration,
  hrRatioVo2max,
  milesToKm,
  kmToMiles,
  parseDuration,
  raceTimeFromVdot,
  vdotFromRace,
  vo2maxCategory,
  vo2maxNormRow,
  type Sex,
  type Vo2maxNormRow,
} from "@/lib/calc";
import { Card, CopyButton, NumberInput, ResultStat, ResultTable, Segmented, ShareButton, StatGrid, TextInput } from "@/components/ui";
import {
  DistanceField,
  EmptyResult,
  UnitToggle,
  distanceValue,
  durationError,
  fmtNum,
  fmtPace,
  parseNum,
  resolveDistanceKm,
  type DistUnit,
} from "./shared";
import {
  DIST_UNIT_TOKENS,
  distanceField,
  enumField,
  isDuration,
  numIn,
  textField,
  tokenValue,
  useUrlState,
} from "./useUrlState";

type Method = "race" | "cooper" | "hr";
type CooperUnit = "m" | "mile";

const METHOD_LABEL: Record<Method, string> = {
  race: "Race result (VDOT)",
  cooper: "Cooper 12-minute test",
  hr: "Heart-rate ratio (Uth–Sørensen)",
};

const COOPER_UNIT_TOKENS: Record<CooperUnit, string> = { m: "m", mile: "mi" };

/** 12-min distance in metres, valid for the Cooper formula. */
function validCooper(raw: string, u: CooperUnit): boolean {
  const n = parseNum(raw);
  if (n == null || n <= 0) return false;
  const m = u === "m" ? n : milesToKm(n) * 1000;
  return m >= 1000 && m <= 5000;
}

const EQUIV_IDS = ["5k", "10k", "half", "marathon"];

function inRange(s: string, min: number, max: number): number | null {
  const n = parseNum(s);
  return n != null && n >= min && n <= max ? n : null;
}

export default function Vo2maxEstimator() {
  const [method, setMethod] = useState<Method>("race");
  const [dist, setDist] = useState(distanceValue("10k"));
  const [time, setTime] = useState("50:00");
  const [cooper, setCooper] = useState("2400");
  const [cooperUnit, setCooperUnit] = useState<CooperUnit>("m");
  const [maxHr, setMaxHr] = useState("185");
  const [restHr, setRestHr] = useState("55");
  const [age, setAge] = useState("35");
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<DistUnit>("km");

  useUrlState({
    m: enumField(method, setMethod, "race", { race: "race", cooper: "cooper", hr: "hr" }),
    d: distanceField(dist, setDist, "10k", method === "race"),
    t: textField(time, setTime, "50:00", isDuration(), method === "race"),
    cd: textField(
      cooper,
      setCooper,
      "2400",
      (r, params) => validCooper(r, params ? tokenValue(params, "cu", COOPER_UNIT_TOKENS, "m") : cooperUnit),
      method === "cooper",
    ),
    cu: enumField(cooperUnit, setCooperUnit, "m", COOPER_UNIT_TOKENS, method === "cooper"),
    mx: textField(maxHr, setMaxHr, "185", numIn(100, 230), method === "hr"),
    r: textField(restHr, setRestHr, "55", numIn(25, 110), method === "hr"),
    a: textField(age, setAge, "35", numIn(18, 100)),
    sx: enumField(sex, setSex, "male", { male: "m", female: "f" }),
    u: enumField(unit, setUnit, "km", DIST_UNIT_TOKENS),
  });

  const raceKm = resolveDistanceKm(dist);
  const timeErr = method === "race" ? durationError(time, "race time") : undefined;

  const cooperM = (() => {
    const n = parseNum(cooper);
    if (n == null || n <= 0) return null;
    return cooperUnit === "m" ? n : milesToKm(n) * 1000;
  })();
  const cooperErr =
    method === "cooper" && (cooperM == null || cooperM < 1000 || cooperM > 5000)
      ? cooperUnit === "m"
        ? "Enter the distance covered in 12 minutes, 1000–5000 m."
        : "Enter the distance covered in 12 minutes, 0.62–3.1 miles."
      : undefined;

  const maxN = inRange(maxHr, 100, 230);
  const restN = inRange(restHr, 25, 110);
  const maxErr = method === "hr" && maxN == null ? "Enter a max heart rate between 100 and 230 bpm." : undefined;
  const restErr =
    method === "hr"
      ? restN == null
        ? "Enter a resting heart rate between 25 and 110 bpm."
        : maxN != null && restN >= maxN
          ? "Resting HR must be below max HR."
          : undefined
      : undefined;

  const ageN = inRange(age, 18, 100);
  const ageErr = ageN == null ? "Enter an age between 18 and 100 for the fitness category." : undefined;

  const vo2 = useMemo(() => {
    if (method === "race") {
      const t = parseDuration(time);
      return raceKm && t ? vdotFromRace(raceKm, t) : null;
    }
    if (method === "cooper") return cooperM != null ? cooperVo2max(cooperM) : null;
    return maxN != null && restN != null ? hrRatioVo2max(maxN, restN) : null;
  }, [method, time, raceKm, cooperM, maxN, restN]);

  const category = vo2 != null && ageN != null ? vo2maxCategory(vo2, ageN, sex) : null;
  const normRow = ageN != null ? vo2maxNormRow(ageN, sex) : null;

  const equivalents = useMemo(
    () =>
      vo2 == null
        ? []
        : RACE_DISTANCES.filter((d) => EQUIV_IDS.includes(d.id)).map((d) => ({ d, sec: raceTimeFromVdot(vo2, d.km) })),
    [vo2],
  );

  const raceOutOfRange = method === "race" && !timeErr && raceKm != null && vo2 == null;

  const summary =
    vo2 != null
      ? [
          `VO2max estimate: ${fmtNum(vo2)} ml/kg/min – ${METHOD_LABEL[method]} (Endurance Toolkit)`,
          category && ageN != null ? `Rough fitness category (${sex}, age ${ageN}): ${category}` : null,
          ...equivalents.map(
            (e) =>
              `${e.d.label}: ${e.sec != null ? `${formatDuration(e.sec)} (${fmtPace(e.sec / e.d.km, unit)})` : "out of range"}`,
          ),
          "Estimates only – field and formula methods can be off by 10% or more.",
        ]
          .filter(Boolean)
          .join("\n")
      : null;

  return (
    <div className="flex flex-col gap-4">
      <Card title="Your test">
        <div className="flex flex-col gap-4">
          <Segmented
            label="Estimation method"
            value={method}
            onChange={setMethod}
            options={[
              { value: "race", label: "Race result" },
              { value: "cooper", label: "Cooper 12-min" },
              { value: "hr", label: "Heart rate" },
            ]}
          />
          {method === "race" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DistanceField label="Race distance" value={dist} onChange={setDist} allPresets />
              <TextInput
                label="Finish time"
                value={time}
                onChange={setTime}
                placeholder="h:mm:ss"
                hint="h:mm:ss or mm:ss — a recent, all-out effort."
                error={timeErr}
              />
            </div>
          )}
          {method === "cooper" && (
            <div className="flex flex-wrap items-end gap-3">
              <NumberInput
                label="Distance in 12 minutes"
                value={cooper}
                onChange={setCooper}
                min={0}
                step="any"
                hint="Run as far as you can in exactly 12 minutes, ideally on a track."
                error={cooperErr}
                className="min-w-40 flex-1"
              />
              <Segmented
                label="Cooper distance unit"
                hideLabel
                value={cooperUnit}
                onChange={(u) => {
                  const n = parseNum(cooper);
                  if (n != null && n > 0 && u !== cooperUnit) {
                    setCooper(u === "m" ? String(Math.round(milesToKm(n) * 1000)) : fmtNum(kmToMiles(n / 1000), 2));
                  }
                  setCooperUnit(u);
                }}
                options={[
                  { value: "m", label: "metres" },
                  { value: "mile", label: "miles" },
                ]}
              />
            </div>
          )}
          {method === "hr" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Max heart rate"
                value={maxHr}
                onChange={setMaxHr}
                min={100}
                max={230}
                step={1}
                inputMode="numeric"
                suffix="bpm"
                hint="Measured, not age-predicted, for a meaningful estimate."
                error={maxErr}
              />
              <NumberInput
                label="Resting heart rate"
                value={restHr}
                onChange={setRestHr}
                min={25}
                max={110}
                step={1}
                inputMode="numeric"
                suffix="bpm"
                hint="Lying down, just after waking."
                error={restErr}
              />
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberInput
              label="Age"
              value={age}
              onChange={setAge}
              min={18}
              max={100}
              step={1}
              inputMode="numeric"
              suffix="years"
              hint="Used only for the rough fitness category."
              error={ageErr}
            />
            <Segmented
              label="Sex (for category norms)"
              value={sex}
              onChange={setSex}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Your VO2max estimate"
        actions={
          <>
            <UnitToggle value={unit} onChange={setUnit} />
            <CopyButton text={summary} />
            <ShareButton />
          </>
        }
      >
        {vo2 != null ? (
          <div className="flex flex-col gap-4">
            <StatGrid cols={2}>
              <ResultStat label="VO2max" value={fmtNum(vo2)} sub="ml/kg/min (estimated)" emphasis />
              <ResultStat
                label="Rough category"
                value={category ?? "—"}
                sub={normRow ? `${sex === "male" ? "Men" : "Women"} ${normRow.label}` : "Enter your age"}
              />
            </StatGrid>
            {method === "race" && (
              <p className="text-sm text-muted">
                VDOT is Daniels&apos; &quot;effective VO2max&quot;: the VO2max that explains your race time if your running
                economy is typical. It is a performance score rather than a lab measurement.
              </p>
            )}

            <ResultTable<Vo2maxNormRow>
              caption={`Rough guide: VO2max categories for ${sex === "male" ? "men" : "women"} (ml/kg/min)`}
              rows={VO2MAX_NORMS[sex]}
              rowKey={(r) => r.label}
              highlight={(r) => r === normRow}
              dense
              columns={[
                { key: "a", header: "Age", cell: (r) => r.label, rowHeader: true },
                { key: "b", header: "Below avg", cell: (r) => `< ${r.average}`, align: "right" },
                { key: "v", header: "Average", cell: (r) => `${r.average}–${r.good - 1}`, align: "right" },
                { key: "g", header: "Good", cell: (r) => `${r.good}–${r.excellent - 1}`, align: "right" },
                { key: "e", header: "Excellent", cell: (r) => `≥ ${r.excellent}`, align: "right" },
              ]}
            />
            <p className="text-xs text-muted">
              Rough guide only: bands are rounded and simplified from commonly cited adult norms (Cooper Institute /
              ACSM-style tables), which were built from lab tests of mostly non-athlete populations. They are not a
              clinical or medical classification.
            </p>

            <ResultTable
              caption="Race potential at this VO2max (as VDOT)"
              rows={equivalents}
              rowKey={(e) => e.d.id}
              columns={[
                { key: "d", header: "Race", cell: (e) => e.d.label, rowHeader: true },
                {
                  key: "t",
                  header: "Equivalent time",
                  cell: (e) => (e.sec != null ? formatDuration(e.sec) : "out of range"),
                  align: "right",
                },
                {
                  key: "p",
                  header: unit === "km" ? "Pace /km" : "Pace /mile",
                  cell: (e) => (e.sec != null ? fmtPace(e.sec / e.d.km, unit, false) : "—"),
                  align: "right",
                },
              ]}
            />
            <p className="text-xs text-muted">
              {method === "race"
                ? "Equivalent times assume you are equally trained for each distance; the marathon also needs the long-run endurance to back it up."
                : "Treating a test-based VO2max as VDOT assumes average running economy and full endurance training, so these times are usually optimistic. Estimates from field tests and formulas can be off by 10% or more."}{" "}
              Times outside roughly 3.5 minutes to 5 hours are not predicted.
            </p>
          </div>
        ) : (
          <EmptyResult>
            {raceOutOfRange
              ? "The race method works for races of roughly 1.5–50 km lasting 3.5 minutes to 5 hours. Check your distance and time."
              : "Fix the highlighted fields to see your VO2max estimate."}
          </EmptyResult>
        )}
      </Card>
    </div>
  );
}
