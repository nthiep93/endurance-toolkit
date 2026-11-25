"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { RACE_DISTANCES, parseDuration } from "@/lib/calc";
import { parseNum, type DistanceValue } from "./shared";

/**
 * Shareable tool inputs via the query string — without useSearchParams, so tool pages stay
 * fully prerenderable under cacheComponents (no Suspense / CSR bailout).
 *
 * - First render always uses the component's own defaults (identical on server and client).
 * - After mount, known keys are read from window.location.search, validated and applied;
 *   unknown keys and malformed values are ignored (the default stays).
 * - Changes are written back (debounced) with history.replaceState: no navigation, no scroll,
 *   no new history entries. Values equal to their default (or invalid / irrelevant ones) are
 *   omitted, so a pristine page has no query string. Foreign params (utm_*, …) and the hash
 *   are preserved.
 */

export interface UrlField {
  /** Serialized current value; null = don't write (invalid/incomplete input). */
  value: string | null;
  /** Serialized default; never written to the URL. */
  defaultValue: string;
  /** Validate a raw query value and apply it to state. `params` gives access to sibling keys. */
  apply: (raw: string, params: URLSearchParams) => void;
  /** Irrelevant in the current mode → omitted from the URL. Default true. */
  active?: boolean;
}

export type UrlFields = Record<string, UrlField>;

const WRITE_DELAY_MS = 300;
const MAX_RAW_LEN = 40;
/** Dispatched by ShareButton so a pending debounced write lands before the URL is read. */
export const URL_STATE_FLUSH_EVENT = "urlstate:flush";

/** encodeURIComponent, but keep ":" readable (valid in a query) — t=4:00:00 rather than t=4%3A00%3A00. */
const enc = (s: string) => encodeURIComponent(s).replace(/%3A/gi, ":");

function serialize(fields: UrlFields): string {
  const parts: string[] = [];
  for (const [key, f] of Object.entries(fields)) {
    if (f.active === false || f.value == null || f.value === f.defaultValue) continue;
    parts.push(`${enc(key)}=${enc(f.value)}`);
  }
  return parts.join("&");
}

function buildUrl(fields: UrlFields, ours: string): string {
  const current = new URLSearchParams(window.location.search);
  const foreign: string[] = [];
  current.forEach((v, k) => {
    if (!(k in fields)) foreign.push(`${enc(k)}=${enc(v)}`);
  });
  const qs = [ours, ...foreign].filter(Boolean).join("&");
  return `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
}

export function useUrlState(fields: UrlFields): void {
  // Becomes true after the URL has been read, so the initial (default) render never wipes
  // incoming params before they are applied.
  const [ready, setReady] = useState(false);
  const query = serialize(fields);

  const readFromUrl = useEffectEvent(() => {
    const params = new URLSearchParams(window.location.search);
    for (const [key, f] of Object.entries(fields)) {
      const raw = params.get(key);
      if (raw == null) continue;
      const v = raw.trim();
      if (!v || v.length > MAX_RAW_LEN) continue;
      try {
        f.apply(v, params);
      } catch {
        /* malformed → keep default */
      }
    }
    setReady(true);
  });

  const write = useEffectEvent(() => {
    const next = buildUrl(fields, query);
    const now = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== now) window.history.replaceState(null, "", next);
  });

  useEffect(() => {
    // Intentional: the URL is external state that must only be read after hydration
    // (first render = defaults on server and client); applying it once on mount is the point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    readFromUrl();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(write, WRITE_DELAY_MS);
    const flush = () => {
      clearTimeout(timer);
      write();
    };
    window.addEventListener(URL_STATE_FLUSH_EVENT, flush);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(URL_STATE_FLUSH_EVENT, flush);
    };
  }, [ready, query]);
}

/* ------------------------------------------------------------------ field builders */

/** Free-text field (durations, paces, numbers) validated by `isValid`. */
export function textField(
  value: string,
  set: (v: string) => void,
  defaultValue: string,
  /** `params` is set when validating an incoming URL (read sibling keys such as units from it);
   *  it is undefined when validating the current state for writing. */
  isValid: (raw: string, params?: URLSearchParams) => boolean,
  active?: boolean,
): UrlField {
  const v = value.trim();
  return {
    value: v && isValid(v) ? v : null,
    defaultValue,
    apply: (raw, params) => {
      if (isValid(raw, params)) set(raw);
    },
    active,
  };
}

/** Whitelisted enum, with short URL tokens: enumField(unit, setUnit, "km", { km: "km", mile: "mi" }). */
export function enumField<T extends string>(
  value: T,
  set: (v: T) => void,
  defaultValue: T,
  tokens: Record<T, string>,
  active?: boolean,
): UrlField {
  const entries = Object.entries(tokens) as Array<[T, string]>;
  return {
    value: tokens[value] ?? null,
    defaultValue: tokens[defaultValue],
    apply: (raw) => {
      const hit = entries.find(([, tok]) => tok === raw);
      if (hit) set(hit[0]);
    },
    active,
  };
}

/** Numeric state (not string) within [min, max]. */
export function numberField(
  value: number,
  set: (v: number) => void,
  defaultValue: number,
  min: number,
  max: number,
  active?: boolean,
): UrlField {
  return {
    value: String(value),
    defaultValue: String(defaultValue),
    apply: (raw) => {
      const n = parseNum(raw);
      if (n != null && n >= min && n <= max) set(n);
    },
    active,
  };
}

/* ------------------------------------------------------------------ validators */

/** Number string within [min, max] (inclusive unless `exclusiveMin`). */
export const numIn =
  (min: number, max: number, exclusiveMin = false) =>
  (raw: string): boolean => {
    const n = parseNum(raw);
    return n != null && (exclusiveMin ? n > min : n >= min) && n <= max;
  };

/** Positive h:mm:ss / mm:ss duration, optionally capped. */
export const isDuration =
  (maxSec = 7 * 24 * 3600) =>
  (raw: string): boolean => {
    const s = parseDuration(raw);
    return s != null && s > 0 && s <= maxSec;
  };

/* ------------------------------------------------------------------ distance */

const CUSTOM_DIST_RE = /^(\d{1,4}(?:\.\d{1,4})?)(km|mi)$/;

/**
 * DistanceField state as one param: a RACE_DISTANCES id ("marathon", "10k") or a custom
 * distance with unit suffix ("15km", "6.2mi").
 */
export function distanceField(
  dist: DistanceValue,
  set: (v: DistanceValue) => void,
  defaultPreset: string,
  active?: boolean,
): UrlField {
  let value: string | null = dist.preset;
  if (dist.preset === "custom") {
    const n = parseNum(dist.custom);
    const raw = n != null ? `${n}${dist.customUnit === "km" ? "km" : "mi"}` : "";
    value = n != null && n > 0 && n <= 1000 && CUSTOM_DIST_RE.test(raw) ? raw : null;
  }
  return {
    value,
    defaultValue: defaultPreset,
    apply: (raw) => {
      if (RACE_DISTANCES.some((d) => d.id === raw)) {
        set({ ...dist, preset: raw });
        return;
      }
      const m = CUSTOM_DIST_RE.exec(raw);
      if (!m) return;
      const n = Number(m[1]);
      if (!(n > 0 && n <= 1000)) return;
      set({ preset: "custom", custom: m[1], customUnit: m[2] === "km" ? "km" : "mile" });
    },
    active,
  };
}

/** Short tokens for the shared km/mile unit. */
export const DIST_UNIT_TOKENS: Record<"km" | "mile", string> = { km: "km", mile: "mi" };

/** Resolve a token-mapped enum from incoming params (for validators of sibling fields). */
export function tokenValue<T extends string>(
  params: URLSearchParams,
  key: string,
  tokens: Record<T, string>,
  fallback: T,
): T {
  const raw = params.get(key)?.trim();
  const hit = (Object.entries(tokens) as Array<[T, string]>).find(([, tok]) => tok === raw);
  return hit ? hit[0] : fallback;
}
