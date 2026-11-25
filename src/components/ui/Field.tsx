import type { ReactNode } from "react";
import { cx } from "./cx";

interface FieldProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** ids used for aria-describedby wiring */
export function fieldIds(id: string) {
  return { hintId: `${id}-hint`, errorId: `${id}-error` };
}

export function describedBy(id: string, hint?: ReactNode, error?: ReactNode): string | undefined {
  const { hintId, errorId } = fieldIds(id);
  const ids = [hint ? hintId : null, error ? errorId : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

/** Label + control + hint + inline error. */
export function Field({ id, label, hint, error, children, className }: FieldProps) {
  const { hintId, errorId } = fieldIds(id);
  return (
    <div className={cx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-warn">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full min-w-0 rounded-xl border border-line bg-bg px-3 py-2.5 text-base text-fg tabular placeholder:text-muted " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand aria-[invalid=true]:border-warn";
