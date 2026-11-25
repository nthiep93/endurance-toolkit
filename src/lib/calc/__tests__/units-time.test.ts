import { describe, it, expect } from "vitest";
import { KM_PER_MILE, RACE_DISTANCES, kmToMiles, milesToKm, parseDuration, formatDuration, formatPace } from "..";

describe("units", () => {
  it("constants and distances", () => {
    expect(KM_PER_MILE).toBe(1.609344);
    expect(RACE_DISTANCES.map((d) => d.id)).toEqual(["1k", "1mile", "5k", "10k", "15k", "10mile", "half", "marathon", "50k"]);
    expect(RACE_DISTANCES.find((d) => d.id === "marathon")!.km).toBe(42.195);
    expect(RACE_DISTANCES.find((d) => d.id === "half")!.km).toBe(21.0975);
    expect(RACE_DISTANCES.find((d) => d.id === "10mile")!.km).toBeCloseTo(16.09344, 6);
    for (const d of RACE_DISTANCES) expect(d.label.length).toBeGreaterThan(0);
  });
  it("km <-> miles", () => {
    expect(kmToMiles(KM_PER_MILE)).toBeCloseTo(1, 12);
    expect(milesToKm(26.2188)).toBeCloseTo(42.195, 3);
    expect(milesToKm(kmToMiles(10))).toBeCloseTo(10, 12);
    expect(kmToMiles(0)).toBe(0);
    expect(kmToMiles(NaN)).toBe(0);
    expect(milesToKm(Infinity)).toBe(0);
  });
});

describe("parseDuration", () => {
  it.each([
    ["3:30:00", 12600],
    ["45:00", 2700],
    ["5:5", 305],
    ["5:05", 305],
    ["90", 90],
    ["  1:02:05  ", 3725],
    ["1 : 02 : 05", 3725],
    ["4:59.5", 299.5],
    ["75:00", 4500],
    ["0", 0],
    ["0:00:30", 30],
    ["12.25", 12.25],
  ])("%s -> %d", (s, v) => {
    expect(parseDuration(s)).toBeCloseTo(v, 9);
  });
  it.each(["", "   ", "-5:00", "5:-1", "abc", "5m", "1:60", "1:00:60", "1:60:00", "1:2:3:4", ":30", "5:", "1.5:00", "1e3", "5::0", "+5", "NaN", "Infinity"])(
    "rejects %j",
    (s) => {
      expect(parseDuration(s)).toBeNull();
    },
  );
  it("rejects non-strings", () => {
    expect(parseDuration(undefined as unknown as string)).toBeNull();
    expect(parseDuration(5 as unknown as string)).toBeNull();
  });
});

describe("formatDuration / formatPace", () => {
  it("formats", () => {
    expect(formatDuration(3725)).toBe("1:02:05");
    expect(formatDuration(305)).toBe("5:05");
    expect(formatDuration(305, { forceHours: true })).toBe("0:05:05");
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(59.6)).toBe("1:00");
    expect(formatDuration(3599.5)).toBe("1:00:00");
    expect(formatDuration(36000)).toBe("10:00:00");
  });
  it("invalid -> placeholder", () => {
    expect(formatDuration(-1)).toBe("--:--");
    expect(formatDuration(NaN)).toBe("--:--");
    expect(formatDuration(Infinity)).toBe("--:--");
  });
  it("pace", () => {
    expect(formatPace(299)).toBe("4:59");
    expect(formatPace(299.4)).toBe("4:59");
    expect(formatPace(299.6)).toBe("5:00");
    expect(formatPace(0)).toBe("--:--");
    expect(formatPace(NaN)).toBe("--:--");
  });
  it("round-trips with parseDuration", () => {
    for (const s of [1, 59, 60, 305, 3599, 3600, 3725, 12600, 86399]) {
      expect(parseDuration(formatDuration(s))).toBe(s);
    }
  });
});
