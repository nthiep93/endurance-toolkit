import { describe, expect, it } from "vitest";
import { GOALS, computeGoal, getGoal, goalPace, neighbours, seoTitle } from "../goals";

describe("goal-pace pages", () => {
  it("has 18 unique slugs in the expected format", () => {
    expect(GOALS).toHaveLength(18);
    expect(new Set(GOALS.map((g) => g.slug)).size).toBe(18);
    for (const s of ["sub-4-marathon-pace", "sub-3-15-marathon-pace", "sub-2-half-marathon-pace", "sub-1-30-half-marathon-pace", "sub-20-5k-pace", "sub-40-10k-pace"]) {
      expect(getGoal(s)).toBeDefined();
    }
  });

  it("computes every goal without throwing, with unique titles", () => {
    const titles = GOALS.map((g) => seoTitle(computeGoal(g)));
    expect(new Set(titles).size).toBe(GOALS.length);
  });

  it("sub-4 marathon matches independent arithmetic", () => {
    const d = computeGoal(getGoal("sub-4-marathon-pace")!);
    const perKm = 14400 / 42.195; // 341.27 s
    expect(d.paceSecPerKm).toBeCloseTo(perKm, 6);
    expect(goalPace(d.paceSecPerKm)).toBe("5:41");
    expect(goalPace(d.paceSecPerMile)).toBe("9:09"); // 341.27 * 1.609344 = 549.23
    const k5 = d.kmCheckpoints.find((c) => c.km === 5)!;
    expect(k5.evenSec).toBeCloseTo(5 * perKm, 6);
    expect(d.halfwayNegSec).toBeCloseTo(7200 * 1.01, 6);
    expect(d.kmCheckpoints.at(-1)!.negSec).toBeCloseTo(14400, 3);
    expect(d.fueling?.gels).toBe(8);
  });

  it("sub-20 5K: per-km checkpoints and no fueling", () => {
    const d = computeGoal(getGoal("sub-20-5k-pace")!);
    expect(d.kmCheckpoints.map((c) => Math.round(c.evenSec))).toEqual([240, 480, 720, 960, 1200]);
    expect(d.fueling).toBeNull();
    expect(d.faqs).toHaveLength(3);
  });

  it("neighbours stay within the distance", () => {
    const n = neighbours(getGoal("sub-4-marathon-pace")!);
    expect(n.faster?.slug).toBe("sub-3-45-marathon-pace");
    expect(n.slower?.slug).toBe("sub-4-30-marathon-pace");
    expect(neighbours(getGoal("sub-3-marathon-pace")!).faster).toBeUndefined();
  });
});
