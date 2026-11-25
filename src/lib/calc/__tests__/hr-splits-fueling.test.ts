import { describe, it, expect } from "vitest";
import { estimateMaxHr, karvonenZones, percentMaxZones, splitPlan, fuelingPlan, KM_PER_MILE, type HrZone } from "..";

describe("estimateMaxHr", () => {
  it("formulas", () => {
    expect(estimateMaxHr(30, "fox")).toBe(190);
    expect(estimateMaxHr(30, "tanaka")).toBe(187);
    expect(estimateMaxHr(30, "gellish")).toBe(186);
    expect(estimateMaxHr(35, "tanaka")).toBe(184); // 183.5 -> 184
    expect(Number.isInteger(estimateMaxHr(33)!)).toBe(true);
  });
  it("invalid", () => {
    expect(estimateMaxHr(0)).toBeNull();
    expect(estimateMaxHr(-3)).toBeNull();
    expect(estimateMaxHr(200)).toBeNull();
    expect(estimateMaxHr(NaN)).toBeNull();
    expect(estimateMaxHr(30, "bogus" as never)).toBeNull();
  });
});

function checkZones(z: HrZone[]) {
  expect(z.map((x) => x.name)).toEqual(["Recovery", "Endurance (aerobic)", "Tempo", "Threshold", "VO2max"]);
  expect(z.map((x) => x.zone)).toEqual([1, 2, 3, 4, 5]);
  expect(z.map((x) => [x.minPct, x.maxPct])).toEqual([[50, 60], [60, 70], [70, 80], [80, 90], [90, 100]]);
  for (let i = 0; i < z.length; i++) {
    expect(Number.isInteger(z[i].minBpm)).toBe(true);
    expect(Number.isInteger(z[i].maxBpm)).toBe(true);
    expect(z[i].minBpm).toBeLessThan(z[i].maxBpm);
    expect(z[i].purpose.length).toBeGreaterThan(0);
    if (i > 0) expect(z[i].minBpm).toBe(z[i - 1].maxBpm);
  }
}

describe("HR zones", () => {
  it("karvonen", () => {
    const z = karvonenZones(190, 50)!;
    checkZones(z);
    expect(z[0].minBpm).toBe(120); // 50 + 0.5*140
    expect(z[3].minBpm).toBe(162); // 50 + 0.8*140
    expect(z[4].maxBpm).toBe(190);
  });
  it("karvonen rounds", () => {
    const z = karvonenZones(187, 53)!; // reserve 134
    checkZones(z);
    expect(z[0].minBpm).toBe(120); // 53+67
    expect(z[1].minBpm).toBe(Math.round(53 + 0.6 * 134)); // 133.4 -> 133
  });
  it("percent max", () => {
    const z = percentMaxZones(185)!;
    checkZones(z);
    expect(z[0].minBpm).toBe(93); // 92.5 -> 93
    expect(z[4].maxBpm).toBe(185);
  });
  it("invalid", () => {
    expect(karvonenZones(190, 190)).toBeNull();
    expect(karvonenZones(150, 160)).toBeNull();
    expect(karvonenZones(0, 50)).toBeNull();
    expect(karvonenZones(190, 0)).toBeNull();
    expect(karvonenZones(NaN, 50)).toBeNull();
    expect(karvonenZones(400, 50)).toBeNull();
    expect(percentMaxZones(0)).toBeNull();
    expect(percentMaxZones(Infinity)).toBeNull();
  });
});

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

describe("splitPlan", () => {
  it("marathon by km, even: 42 full + 0.195 partial", () => {
    const rows = splitPlan({ distanceKm: 42.195, targetSec: 10800, unit: "km", strategy: "even" })!;
    expect(rows).toHaveLength(43);
    expect(rows.slice(0, 42).every((r) => r.distanceKm === 1)).toBe(true);
    expect(rows[42].distanceKm).toBeCloseTo(0.195, 9);
    expect(rows[42].label).toBe("42.195 km");
    expect(rows[0].label).toBe("1 km");
    expect(rows[0].index).toBe(1);
    expect(Math.abs(sum(rows.map((r) => r.splitSec)) - 10800)).toBeLessThan(1);
    expect(Math.abs(rows[42].cumulativeSec - 10800)).toBeLessThan(1);
    for (const r of rows) expect(r.paceSecPerKm).toBeCloseTo(10800 / 42.195, 6);
  });
  it("cumulative is a running sum", () => {
    const rows = splitPlan({ distanceKm: 10, targetSec: 2700, unit: "km", strategy: "negative" })!;
    let c = 0;
    for (const r of rows) {
      c += r.splitSec;
      expect(r.cumulativeSec).toBeCloseTo(c, 9);
    }
  });
  it("exact distance: no zero-length partial split", () => {
    expect(splitPlan({ distanceKm: 10, targetSec: 3000, unit: "km", strategy: "even" })).toHaveLength(10);
    expect(splitPlan({ distanceKm: 3 * KM_PER_MILE, targetSec: 1500, unit: "mile", strategy: "even" })).toHaveLength(3);
  });
  it("marathon by mile", () => {
    const rows = splitPlan({ distanceKm: 42.195, targetSec: 12600, unit: "mile", strategy: "even" })!;
    expect(rows).toHaveLength(27);
    expect(rows[26].distanceKm).toBeCloseTo(42.195 - 26 * KM_PER_MILE, 9);
    expect(rows[26].label).toBe("26.22 mi");
    expect(rows[0].label).toBe("1 mi");
    expect(Math.abs(rows[26].cumulativeSec - 12600)).toBeLessThan(1);
  });
  it("negative split default 2%: first half slower, second faster, total preserved", () => {
    const D = 42.195, T = 10800, avg = T / D;
    const rows = splitPlan({ distanceKm: D, targetSec: T, unit: "km", strategy: "negative" })!;
    expect(Math.abs(rows[rows.length - 1].cumulativeSec - T)).toBeLessThan(1);
    expect(rows[0].paceSecPerKm).toBeCloseTo(avg * 1.01, 9);
    expect(rows[rows.length - 1].paceSecPerKm).toBeCloseTo(avg * 0.99, 9);
    // first-half time exceeds second-half time by ~2% of avg half time
    const halfTime = rows.slice(0, 21).reduce((a, r) => a + r.splitSec, 0) + rows[21].splitSec * (0.0975 / 1);
    expect(halfTime).toBeGreaterThan(T / 2);
    expect(rows.slice(0, 21).every((r) => r.paceSecPerKm > avg)).toBe(true);
    expect(rows.slice(22).every((r) => r.paceSecPerKm < avg)).toBe(true);
    // straddling split (21-22 km) mixes both
    expect(rows[21].paceSecPerKm).toBeGreaterThan(avg * 0.99);
    expect(rows[21].paceSecPerKm).toBeLessThan(avg * 1.01);
  });
  it("custom negativePct", () => {
    const rows = splitPlan({ distanceKm: 10, targetSec: 3000, unit: "km", strategy: "negative", negativePct: 4 })!;
    expect(rows[0].splitSec).toBeCloseTo(306, 9);
    expect(rows[9].splitSec).toBeCloseTo(294, 9);
    expect(Math.abs(sum(rows.map((r) => r.splitSec)) - 3000)).toBeLessThan(1e-6);
  });
  it("negativePct 0 equals even", () => {
    const a = splitPlan({ distanceKm: 5, targetSec: 1500, unit: "km", strategy: "negative", negativePct: 0 })!;
    expect(a.every((r) => Math.abs(r.splitSec - 300) < 1e-9)).toBe(true);
  });
  it("distance shorter than one split", () => {
    const rows = splitPlan({ distanceKm: 0.4, targetSec: 80, unit: "km", strategy: "even" })!;
    expect(rows).toHaveLength(1);
    expect(rows[0].splitSec).toBeCloseTo(80, 9);
    expect(rows[0].label).toBe("0.4 km");
  });
  it("invalid", () => {
    const base = { distanceKm: 10, targetSec: 3000, unit: "km" as const, strategy: "even" as const };
    expect(splitPlan({ ...base, distanceKm: 0 })).toBeNull();
    expect(splitPlan({ ...base, distanceKm: NaN })).toBeNull();
    expect(splitPlan({ ...base, targetSec: -1 })).toBeNull();
    expect(splitPlan({ ...base, targetSec: Infinity })).toBeNull();
    expect(splitPlan({ ...base, unit: "yard" as never })).toBeNull();
    expect(splitPlan({ ...base, strategy: "positive" as never })).toBeNull();
    expect(splitPlan({ ...base, strategy: "negative", negativePct: -1 })).toBeNull();
    expect(splitPlan({ ...base, strategy: "negative", negativePct: NaN })).toBeNull();
    expect(splitPlan({ ...base, strategy: "negative", negativePct: 50 })).toBeNull();
    expect(splitPlan({ ...base, distanceKm: 5000 })).toBeNull(); // >1000 splits
  });
});

describe("fuelingPlan", () => {
  it("under 60 min: no gels", () => {
    const p = fuelingPlan({ durationSec: 50 * 60 })!;
    expect(p.gels).toBe(0);
    expect(p.gelSchedule).toEqual([]);
    expect(p.totalCarbsG).toBe(0);
    expect(p.totalFluidMl).toBe(Math.round(500 * 50 / 60));
  });
  it("defaults for 3:30 marathon", () => {
    const p = fuelingPlan({ durationSec: 3.5 * 3600 })!;
    expect(p.carbsPerHour).toBe(60);
    expect(p.firstGelMin).toBe(35);
    expect(p.gelIntervalMin).toBe(25);
    expect(p.gelSchedule).toEqual([35, 60, 85, 110, 135, 160, 185]);
    expect(p.gels).toBe(7);
    expect(p.totalCarbsG).toBe(175);
    expect(p.fluidMlPerHour).toBe(500);
    expect(p.totalFluidMl).toBe(1750);
    expect(p.sodiumMgPerHour).toBe(400);
  });
  it("no gel within the last 15 minutes; schedule < duration", () => {
    for (const min of [60, 61, 75, 90, 119, 120, 150, 185, 200, 240, 300, 600]) {
      for (const cph of [30, 45, 60, 70, 90]) {
        const p = fuelingPlan({ durationSec: min * 60, carbsPerHour: cph })!;
        expect(p.gels).toBe(p.gelSchedule.length);
        expect(p.totalCarbsG).toBe(p.gels * 25);
        expect(p.gels).toBeGreaterThanOrEqual(1);
        expect(p.gelSchedule[0]).toBe(p.firstGelMin);
        expect(p.firstGelMin).toBeLessThan(min);
        for (const m of p.gelSchedule) expect(m).toBeLessThanOrEqual(min - 15);
        for (let i = 1; i < p.gelSchedule.length; i++) expect(p.gelSchedule[i]).toBeGreaterThan(p.gelSchedule[i - 1]);
      }
    }
  });
  it("interval from carbsPerHour and gelCarbsG", () => {
    expect(fuelingPlan({ durationSec: 7200, carbsPerHour: 90, gelCarbsG: 30 })!.gelIntervalMin).toBe(20);
    const p = fuelingPlan({ durationSec: 7200, carbsPerHour: 70 })!;
    expect(p.gelIntervalMin).toBe(21.4);
    expect(p.gelSchedule).toEqual([35, 56, 78, 99]);
  });
  it("60-min run gets exactly one gel at 35", () => {
    expect(fuelingPlan({ durationSec: 3600 })!.gelSchedule).toEqual([35]);
  });
  it("custom fluid / sodium", () => {
    const p = fuelingPlan({ durationSec: 7200, fluidMlPerHour: 700, sodiumMgPerHour: 0 })!;
    expect(p.totalFluidMl).toBe(1400);
    expect(p.sodiumMgPerHour).toBe(0);
  });
  it("invalid", () => {
    expect(fuelingPlan({ durationSec: 0 })).toBeNull();
    expect(fuelingPlan({ durationSec: NaN })).toBeNull();
    expect(fuelingPlan({ durationSec: Infinity })).toBeNull();
    expect(fuelingPlan({ durationSec: 7200, carbsPerHour: 0 })).toBeNull();
    expect(fuelingPlan({ durationSec: 7200, carbsPerHour: 500 })).toBeNull();
    expect(fuelingPlan({ durationSec: 7200, gelCarbsG: -1 })).toBeNull();
    expect(fuelingPlan({ durationSec: 7200, fluidMlPerHour: 0 })).toBeNull();
    expect(fuelingPlan({ durationSec: 7200, sodiumMgPerHour: -5 })).toBeNull();
    expect(fuelingPlan(null as never)).toBeNull();
  });
});
