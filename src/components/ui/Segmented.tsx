"use client";

import { useId, type ReactNode } from "react";
import { cx } from "./cx";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string> {
  /** Accessible group label (rendered as <legend>). */
  label: ReactNode;
  /** Visually hide the legend (still read by screen readers). */
  hideLabel?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<SegmentOption<T>>;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Segmented toggle built on native radio inputs: arrow-key navigation and
 * screen-reader semantics come for free.
 */
export function Segmented<T extends string>({
  label,
  hideLabel,
  value,
  onChange,
  options,
  size = "md",
  className,
}: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset className={cx("min-w-0", className)}>
      <legend className={cx("mb-1.5 text-sm font-medium text-fg", hideLabel && "sr-only")}>{label}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-line bg-surface-2 p-1">
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              className={cx(
                "relative cursor-pointer rounded-lg text-center font-medium transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-brand",
                size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
                checked ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
