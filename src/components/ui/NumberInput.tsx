"use client";

import { useId, type ReactNode } from "react";
import { Field, describedBy, inputClass } from "./Field";

interface NumberInputProps {
  label: ReactNode;
  /** Kept as a string so users can freely edit (e.g. empty field, "1."). */
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  min?: number;
  max?: number;
  step?: number | "any";
  suffix?: ReactNode;
  placeholder?: string;
  /** "numeric" for integers (bpm, age), "decimal" otherwise. */
  inputMode?: "numeric" | "decimal";
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  hint,
  error,
  min,
  max,
  step = "any",
  suffix,
  placeholder,
  inputMode = "decimal",
  className,
}: NumberInputProps) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={inputClass}
        />
        {suffix ? <span className="shrink-0 text-sm text-muted">{suffix}</span> : null}
      </div>
    </Field>
  );
}

interface RangeInputProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Formatted current value shown next to the label, e.g. "60 g/h". */
  valueLabel: string;
  hint?: ReactNode;
  className?: string;
}

/** Slider with a visible formatted value. */
export function RangeInput({ label, value, onChange, min, max, step = 1, valueLabel, hint, className }: RangeInputProps) {
  const id = useId();
  return (
    <Field
      id={id}
      label={
        <span className="flex items-baseline justify-between gap-2">
          <span>{label}</span>
          <span className="tabular font-semibold text-brand">{valueLabel}</span>
        </span>
      }
      hint={hint}
      className={className}
    >
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueLabel}
        aria-describedby={describedBy(id, hint)}
        className="h-11 w-full cursor-pointer accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />
    </Field>
  );
}
