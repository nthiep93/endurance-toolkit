"use client";

import { useId, type ReactNode, type HTMLAttributes } from "react";
import { Field, describedBy, inputClass } from "./Field";
import { cx } from "./cx";

interface TextInputProps {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  /** Text after the input, e.g. "/km". */
  suffix?: ReactNode;
  /**
   * Durations like "3:30:00" need a colon, which numeric keypads lack on many phones,
   * so default to "text". Use "decimal" for plain numbers.
   */
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  id?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  suffix,
  inputMode = "text",
  className,
  id: idProp,
}: TextInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cx(inputClass)}
        />
        {suffix ? <span className="shrink-0 text-sm text-muted">{suffix}</span> : null}
      </div>
    </Field>
  );
}
