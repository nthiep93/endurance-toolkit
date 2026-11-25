import type { ReactNode } from "react";
import { cx } from "./cx";

interface ResultStatProps {
  label: ReactNode;
  value: ReactNode;
  /** Unit or secondary text under the number. */
  sub?: ReactNode;
  emphasis?: boolean;
  className?: string;
}

/** Big number + label. */
export function ResultStat({ label, value, sub, emphasis, className }: ResultStatProps) {
  return (
    <div className={cx("min-w-0 rounded-xl border border-line bg-surface-2 p-3 sm:p-4", className)}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div
        className={cx(
          "tabular mt-1 break-words font-bold leading-tight",
          emphasis ? "text-3xl text-brand sm:text-4xl" : "text-2xl text-fg sm:text-3xl",
        )}
      >
        {value}
      </div>
      {sub ? <div className="mt-0.5 text-sm text-muted">{sub}</div> : null}
    </div>
  );
}

const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" } as const;

/** Responsive grid of ResultStats: 2 columns on phones, `cols` from sm up. */
export function StatGrid({ children, cols = 3, className }: { children: ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  return <div className={cx("grid grid-cols-2 gap-3", colClass[cols], className)}>{children}</div>;
}
