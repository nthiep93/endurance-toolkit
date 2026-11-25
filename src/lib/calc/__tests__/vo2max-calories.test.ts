import { describe, it, expect } from "vitest";
import {
  cooperVo2max,
  hrRatioVo2max,
  vo2maxCategory,
  vo2maxNormRow,
  VO2MAX_NORMS,
  acsmRunningVo2,
  runningCalories,
} from "..";

describe("cooperVo2max", () => {
  it("2400 m ≈ 42.4", () => {
    expect(cooperVo2max(2400)!).toBeCloseTo(42.3675, 4); // (2400 − 504.9) / 44.73
    expect(cooperVo2max(3000)!).toBeCloseTo(55.781, 3);
  });
  it("invalid", () => {
    expect(cooperVo2max(999)).toBeNull();
    expect(cooperVo2max(5001)).toBeNull();
    expect(cooperVo2max(0)).toBeNull();
    expect(cooperVo2max(NaN)).toBeNull();
  });
});

describe("hrRatioVo2max", () => {
  it("max 190 rest 50 → 58.1", () => {
    expect(hrRatioVo2max(190, 50)!).toBeCloseTo(58.14, 2);
    expect(hrRatioVo2max(185, 55)!).toBeCloseTo(51.464, 3);
  });
  it("invalid", () => {
    expect(hrRatioVo2max(190, 190)).toBeNull();
    expect(hrRatioVo2max(150, 160)).toBeNull();
    expect(hrRatioVo2max(270, 50)).toBeNull();
    expect(hrRatioVo2max(190, 10)).toBeNull();
    expect(hrRatioVo2max(NaN, 50)).toBeNull();
  });
});

describe("vo2max categories", () => {
  it("bands are monotonic", () => {
    for (const rows of Object.values(VO2MAX_NORMS)) {
      for (const r of rows) {
        expect(r.average).toBeLessThan(r.good);
        expect(r.good).toBeLessThan(r.excellent);
      }
    }
  });
  it("classifies", () => {
    expect(vo2maxCategory(42.4, 35, "male")).toBe("Good");
    expect(vo2maxCategory(52, 25, "male")).toBe("Excellent");
    expect(vo2maxCategory(30, 45, "female")).toBe("Average");
    expect(vo2maxCategory(20, 65, "female")).toBe("Below average");
    expect(vo2maxNormRow(70, "male")!.label).toBe("60+");
  });
  it("invalid", () => {
    expect(vo2maxCategory(40, 15, "male")).toBeNull();
    expect(vo2maxCategory(0, 30, "male")).toBeNull();
    expect(vo2maxCategory(40, 30, "other" as never)).toBeNull();
  });
});

describe("acsmRunningVo2", () => {
  it("flat and incline", () => {
    expect(acsmRunningVo2(200)!).toBeCloseTo(43.5, 6);
    expect(acsmRunningVo2(200, 5)!).toBeCloseTo(52.5, 6); // + 0.9·200·0.05
  });
  it("invalid", () => {
    expect(acsmRunningVo2(0)).toBeNull();
    expect(acsmRunningVo2(200, -1)).toBeNull();
    expect(acsmRunningVo2(200, 31)).toBeNull();
  });
});

describe("runningCalories", () => {
  it("70 kg, 10 km at 6:00/km, flat", () => {
    const r = runningCalories({ weightKg: 70, distanceKm: 10, paceSecPerKm: 360 })!;
    expect(r.durationSec).toBe(3600);
    expect(r.vo2MlKgMin).toBeCloseTo(36.8333, 3);
    expect(r.grossKcal).toBeCloseTo(773.5, 6);
    expect(r.netKcal).toBeCloseTo(700, 6);
    expect(r.ruleOfThumbKcal).toBe(700);
    expect(r.grossKcalPerHour).toBeCloseTo(773.5, 6);
    expect(r.belowRunningSpeed).toBe(false);
  });
  it("same result from distance+time and time+pace", () => {
    const a = runningCalories({ weightKg: 70, distanceKm: 10, durationSec: 3600 })!;
    const b = runningCalories({ weightKg: 70, durationSec: 3600, paceSecPerKm: 360 })!;
    expect(a.grossKcal).toBeCloseTo(773.5, 6);
    expect(b.distanceKm).toBeCloseTo(10, 9);
    expect(b.grossKcal).toBeCloseTo(773.5, 6);
  });
  it("incline adds cost", () => {
    const r = runningCalories({ weightKg: 70, distanceKm: 10, paceSecPerKm: 360, gradePct: 5 })!;
    // extra 0.9·166.67·0.05 = 7.5 ml/kg/min → +7.5·0.35·60 = +157.5 kcal
    expect(r.grossKcal).toBeCloseTo(931, 6);
    expect(r.netKcal).toBeCloseTo(857.5, 6);
  });
  it("flags slow speed", () => {
    expect(runningCalories({ weightKg: 70, distanceKm: 5, paceSecPerKm: 480 })!.belowRunningSpeed).toBe(true);
  });
  it("invalid", () => {
    expect(runningCalories({ weightKg: 70, distanceKm: 10 })).toBeNull();
    expect(runningCalories({ weightKg: 70, distanceKm: 10, durationSec: 3600, paceSecPerKm: 360 })).toBeNull();
    expect(runningCalories({ weightKg: 10, distanceKm: 10, paceSecPerKm: 360 })).toBeNull();
    expect(runningCalories({ weightKg: 70, distanceKm: 10, paceSecPerKm: 60 })).toBeNull();
    expect(runningCalories({ weightKg: 70, distanceKm: 0, paceSecPerKm: 360 })).toBeNull();
    expect(runningCalories({ weightKg: 70, distanceKm: 10, paceSecPerKm: 360, gradePct: -2 })).toBeNull();
    expect(runningCalories({ weightKg: 70, durationSec: 25 * 3600, paceSecPerKm: 360 })).toBeNull();
  });
});
