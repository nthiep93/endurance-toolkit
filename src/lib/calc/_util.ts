/** Internal helpers (not re-exported from index). */
export function isPos(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}
export function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}
