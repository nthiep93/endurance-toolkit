"use client";

import { useId, type ReactNode } from "react";
import { Field, describedBy, inputClass } from "./Field";
import { cx } from "./cx";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label: ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<SelectOption<T>>;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
}

export function Select<T extends string>({ label, value, onChange, options, hint, error, className }: SelectProps<T>) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cx(inputClass, "cursor-pointer")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
