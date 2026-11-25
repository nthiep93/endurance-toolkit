import { describe, it, expect } from "vitest";
import { vdotFromRace, raceTimeFromVdot, trainingPaces, riegelPredict, predictAll, RACE_DISTANCES, parseDuration } from "..";

describe("vdotFromRace", () => {
  it("sanity anchors", () => {
    expect(vdotFromRace(5, 1200)!).toBeCloseTo(49.8, 1);
    expect(Math.abs(vdotFromRace(42.195, 10800)! - 53.5)).toBeLessThanOrEqual(0.5);
  });
  it("faster -> higher", () => {
    expect(vdotFromRace(10, 2400)!).toBeGreaterThan(vdotFromRace(10, 2500)!);
  });
  it("outside envelope / invalid -> null", () => {
    expect(vdotFromRace(1, 200)).toBeNull(); // < 1.5 km
    expect(vdotFromRace(100, 30000)).toBeNull(); // > 50 km
    expect(vdotFromRace(1.5, 180)).toBeNull(); // < 3.5 min
    expect(vdotFromRace(42.195, 301 * 60)).toBeNull(); // > 300 min
    expect(vdotFromRace(0, 1200)).toBeNull();
    expect(vdotFromRace(5, 0)).toBeNull();
    expect(vdotFromRace(5, -1)).toBeNull();
    expect(vdotFromRace(NaN, 1200)).toBeNull();
    expect(vdotFromRace(5, Infinity)).toBeNull();
  });
});

describe("raceTimeFromVdot", () => {
  it("round-trips within 2 s for 5K..marathon", () => {
    const cases: [number, string][] = [
      [5, "15:00"], [5, "20:00"], [5, "32:00"],
      [10, "33:00"], [10, "50:00"], [15, "1:05:00"],
      [21.0975, "1:30:00"], [21.0975, "2:10:00"],
      [42.195, "2:30:00"], [42.195, "3:00:00"], [42.195, "4:30:00"],
    ];
    for (const [km, t] of cases) {
      const sec = parseDuration(t)!;
      const v = vdotFromRace(km, sec)!;
      expect(v).not.toBeNull();
      expect(Math.abs(raceTimeFromVdot(v, km)! - sec)).toBeLessThan(2);
    }
  });
  it("VDOT 50 equivalents are sensible", () => {
    const t5 = raceTimeFromVdot(50, 5)!;
    const tm = raceTimeFromVdot(50, 42.195)!;
    expect(t5).toBeGreaterThan(19 * 60 + 40);
    expect(t5).toBeLessThan(20 * 60);
    expect(tm).toBeGreaterThan(3 * 3600 + 5 * 60);
    expect(tm).toBeLessThan(3 * 3600 + 12 * 60);
  });
  it("invalid / out of envelope", () => {
    expect(raceTimeFromVdot(0, 5)).toBeNull();
    expect(raceTimeFromVdot(-10, 5)).toBeNull();
    expect(raceTimeFromVdot(NaN, 5)).toBeNull();
    expect(raceTimeFromVdot(50, 0)).toBeNull();
    expect(raceTimeFromVdot(50, Infinity)).toBeNull();
    expect(raceTimeFromVdot(50, 1)).toBeNull(); // 1 km below envelope
    expect(raceTimeFromVdot(50, 100)).toBeNull();
    expect(raceTimeFromVdot(20, 42.195)).toBeNull(); // > 300 min
  });
});

describe("trainingPaces", () => {
  const p = trainingPaces(50)!;
  it("VDOT 50 anchors", () => {
    expect(p.threshold.minSecPerKm).toBeGreaterThanOrEqual(250);
    expect(p.threshold.maxSecPerKm).toBeLessThanOrEqual(262);
    expect(p.easy.minSecPerKm).toBeGreaterThanOrEqual(305);
    expect(p.easy.maxSecPerKm).toBeLessThanOrEqual(355);
    // Daniels' table: I ≈ 3:50/km, R ≈ 3:35/km, M ≈ 4:31/km at VDOT 50
    expect(p.interval.minSecPerKm).toBeGreaterThan(225);
    expect(p.interval.minSecPerKm).toBeLessThan(235);
    expect(p.marathon.minSecPerKm).toBeCloseTo(raceTimeFromVdot(50, 42.195)! / 42.195, 9);
    expect(p.marathon.maxSecPerKm).toBe(p.marathon.minSecPerKm);
  });
  it("repetition = interval - 15 s/km ± 2 s", () => {
    expect(p.repetition.minSecPerKm).toBeCloseTo(p.interval.minSecPerKm - 17, 9);
    expect(p.repetition.maxSecPerKm).toBeCloseTo(p.interval.minSecPerKm - 13, 9);
  });
  it("ordering: R < I < T < M < E and min <= max", () => {
    for (const v of [30, 40, 50, 60, 70, 85]) {
      const q = trainingPaces(v)!;
      for (const r of [q.easy, q.marathon, q.threshold, q.interval, q.repetition]) {
        expect(r.minSecPerKm).toBeLessThanOrEqual(r.maxSecPerKm);
      }
      expect(q.repetition.maxSecPerKm).toBeLessThan(q.interval.minSecPerKm);
      expect(q.interval.maxSecPerKm).toBeLessThan(q.threshold.minSecPerKm);
      expect(q.threshold.maxSecPerKm).toBeLessThan(q.marathon.minSecPerKm);
      expect(q.marathon.maxSecPerKm).toBeLessThan(q.easy.minSecPerKm);
    }
  });
  it("higher VDOT -> faster paces", () => {
    expect(trainingPaces(60)!.threshold.minSecPerKm).toBeLessThan(p.threshold.minSecPerKm);
  });
  it("low VDOT still yields marathon pace (fallback past 300-min envelope)", () => {
    const q = trainingPaces(20)!;
    expect(q.marathon.minSecPerKm).toBeGreaterThan(400);
  });
  it("invalid", () => {
    expect(trainingPaces(0)).toBeNull();
    expect(trainingPaces(-5)).toBeNull();
    expect(trainingPaces(5)).toBeNull();
    expect(trainingPaces(150)).toBeNull();
    expect(trainingPaces(NaN)).toBeNull();
    expect(trainingPaces(Infinity)).toBeNull();
  });
});

describe("riegelPredict", () => {
  it("default exponent 1.06", () => {
    expect(riegelPredict(1200, 5, 10)!).toBeCloseTo(1200 * Math.pow(2, 1.06), 9);
    expect(riegelPredict(1200, 5, 5)).toBe(1200);
  });
  it("custom exponent", () => {
    expect(riegelPredict(1200, 5, 10, 1)!).toBeCloseTo(2400, 9);
  });
  it("invalid", () => {
    expect(riegelPredict(0, 5, 10)).toBeNull();
    expect(riegelPredict(1200, 0, 10)).toBeNull();
    expect(riegelPredict(1200, 5, -1)).toBeNull();
    expect(riegelPredict(NaN, 5, 10)).toBeNull();
    expect(riegelPredict(1200, 5, 10, 0)).toBeNull();
    expect(riegelPredict(1200, 5, 10, NaN)).toBeNull();
  });
});

describe("predictAll", () => {
  it("one row per RACE_DISTANCES entry", () => {
    const rows = predictAll(1200, 5);
    expect(rows).toHaveLength(RACE_DISTANCES.length);
    rows.forEach((r, i) => {
      expect(r.distance).toBe(RACE_DISTANCES[i]);
      expect(r.riegelSec).toBeCloseTo(riegelPredict(1200, 5, r.distance.km)!, 9);
      expect(r.paceSecPerKm).toBeCloseTo(r.riegelSec / r.distance.km, 9);
    });
  });
  it("vdotSec from raceTimeFromVdot(vdotFromRace(...)), null outside range", () => {
    const rows = predictAll(1200, 5);
    const v = vdotFromRace(5, 1200)!;
    const byId = Object.fromEntries(rows.map((r) => [r.distance.id, r]));
    expect(byId["1k"].vdotSec).toBeNull();
    expect(byId["5k"].vdotSec!).toBeCloseTo(1200, 0);
    expect(byId["marathon"].vdotSec!).toBeCloseTo(raceTimeFromVdot(v, 42.195)!, 6);
    expect(byId["1mile"].vdotSec).not.toBeNull();
  });
  it("input outside VDOT envelope -> all vdotSec null", () => {
    const rows = predictAll(180, 1);
    expect(rows).toHaveLength(RACE_DISTANCES.length);
    expect(rows.every((r) => r.vdotSec === null)).toBe(true);
  });
  it("invalid -> []", () => {
    expect(predictAll(0, 5)).toEqual([]);
    expect(predictAll(1200, NaN)).toEqual([]);
  });
});
