import { describe, it, expect } from "vitest";
import {
  solvePace, pacePerKmToPerMile, pacePerMileToPerKm, paceToKmh, kmhToPace, paceToMph, mphToPacePerKm,
  strideLengthM, cadenceForPace, paceFromCadenceStride, KM_PER_MILE,
} from "..";

describe("solvePace", () => {
  it("distance + time", () => {
    const s = solvePace({ distanceKm: 10, timeSec: 3000 })!;
    expect(s.paceSecPerKm).toBe(300);
    expect(s.paceSecPerMile).toBeCloseTo(300 * KM_PER_MILE, 9);
    expect(s.speedKmh).toBeCloseTo(12, 12);
    expect(s.speedMph).toBeCloseTo(12 / KM_PER_MILE, 12);
  });
  it("distance + pace", () => {
    const s = solvePace({ distanceKm: 42.195, paceSecPerKm: 240 })!;
    expect(s.timeSec).toBeCloseTo(10126.8, 6);
    expect(s.distanceKm).toBe(42.195);
  });
  it("time + pace", () => {
    const s = solvePace({ timeSec: 1500, paceSecPerKm: 300 })!;
    expect(s.distanceKm).toBe(5);
  });
  it("invalid", () => {
    expect(solvePace({ distanceKm: 10 })).toBeNull();
    expect(solvePace({})).toBeNull();
    expect(solvePace({ distanceKm: 10, timeSec: 3000, paceSecPerKm: 300 })).toBeNull();
    expect(solvePace({ distanceKm: 0, timeSec: 3000 })).toBeNull();
    expect(solvePace({ distanceKm: -1, timeSec: 3000 })).toBeNull();
    expect(solvePace({ distanceKm: NaN, timeSec: 3000 })).toBeNull();
    expect(solvePace({ timeSec: Infinity, paceSecPerKm: 300 })).toBeNull();
    expect(solvePace(null as unknown as Parameters<typeof solvePace>[0])).toBeNull();
  });
});

describe("pace conversions", () => {
  it("km <-> mile pace", () => {
    expect(pacePerKmToPerMile(300)).toBeCloseTo(482.8032, 6);
    expect(pacePerMileToPerKm(pacePerKmToPerMile(277))).toBeCloseTo(277, 9);
  });
  it("speed", () => {
    expect(paceToKmh(300)).toBe(12);
    expect(kmhToPace(12)).toBe(300);
    expect(paceToMph(mphToPacePerKm(7.5)!)).toBeCloseTo(7.5, 12);
    expect(mphToPacePerKm(10)).toBeCloseTo(3600 / (10 * KM_PER_MILE), 9);
  });
  it("invalid", () => {
    expect(pacePerKmToPerMile(0)).toBe(0);
    expect(pacePerMileToPerKm(NaN)).toBe(0);
    expect(paceToKmh(0)).toBe(0);
    expect(paceToMph(-3)).toBe(0);
    expect(kmhToPace(0)).toBeNull();
    expect(kmhToPace(Infinity)).toBeNull();
    expect(mphToPacePerKm(-1)).toBeNull();
    expect(mphToPacePerKm(NaN)).toBeNull();
  });
});

describe("cadence", () => {
  it("stride length", () => {
    // 5:00/km = 200 m/min; at 180 spm -> 1.111 m
    expect(strideLengthM(300, 180)).toBeCloseTo(200 / 180, 12);
  });
  it("cadence for pace", () => {
    expect(cadenceForPace(300, 1.25)).toBeCloseTo(160, 12);
  });
  it("pace from cadence/stride", () => {
    expect(paceFromCadenceStride(180, 200 / 180)).toBeCloseTo(300, 9);
  });
  it("consistent round trip", () => {
    const stride = strideLengthM(255, 172)!;
    expect(cadenceForPace(255, stride)).toBeCloseTo(172, 9);
    expect(paceFromCadenceStride(172, stride)).toBeCloseTo(255, 9);
  });
  it("invalid", () => {
    expect(strideLengthM(0, 180)).toBeNull();
    expect(strideLengthM(300, 0)).toBeNull();
    expect(cadenceForPace(NaN, 1)).toBeNull();
    expect(cadenceForPace(300, -1)).toBeNull();
    expect(paceFromCadenceStride(Infinity, 1)).toBeNull();
    expect(paceFromCadenceStride(180, 0)).toBeNull();
  });
});
