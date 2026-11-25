const INT_RE = /^\d+$/;
const DEC_RE = /^\d+(?:\.\d+)?$/;

/**
 * Accepts "h:mm:ss", "mm:ss", "m:ss", "ss", with optional decimals on seconds.
 * Leading component may be any size ("90" = 90 s, "75:00" = 75 min); non-leading
 * components must be < 60. Whitespace around the input and around each part is ignored.
 * Returns seconds, or null for empty / malformed / negative input.
 */
export function parseDuration(input: string): number | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed === "") return null;
  const parts = trimmed.split(":").map((p) => p.trim());
  if (parts.length > 3) return null;
  let total = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const isLast = i === parts.length - 1;
    if (!(isLast ? DEC_RE : INT_RE).test(p)) return null;
    const v = Number(p);
    if (!Number.isFinite(v)) return null;
    if (i > 0 && v >= 60) return null;
    total = total * 60 + v;
  }
  return Number.isFinite(total) ? total : null;
}

/** 3725 -> "1:02:05"; 305 -> "5:05". forceHours => "0:05:05". Rounds to whole seconds.
 *  Invalid (negative / non-finite) input returns "--:--". */
export function formatDuration(totalSec: number, opts?: { forceHours?: boolean }): string {
  if (typeof totalSec !== "number" || !Number.isFinite(totalSec) || totalSec < 0) return "--:--";
  const s = Math.round(totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const ss = String(sec).padStart(2, "0");
  if (h > 0 || opts?.forceHours) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${m}:${ss}`;
}

/** pace seconds -> "4:59" (mm:ss, rounded). Paces of an hour or more use h:mm:ss.
 *  Invalid (<= 0 / non-finite) input returns "--:--". */
export function formatPace(secPerUnit: number): string {
  if (typeof secPerUnit !== "number" || !Number.isFinite(secPerUnit) || secPerUnit <= 0) return "--:--";
  return formatDuration(secPerUnit);
}
