import type { ReactNode } from "react";
import { cx } from "./cx";

interface CardProps {
  title?: ReactNode;
  /** Optional element rendered at the right of the title row (e.g. CopyButton). */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  "aria-label"?: string;
}

export function Card({ title, actions, children, className, as = "section", ...rest }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cx("rounded-2xl border border-line bg-surface p-4 shadow-sm sm:p-6", className)}
      aria-label={rest["aria-label"]}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title ? <h2 className="text-base font-semibold text-fg sm:text-lg">{title}</h2> : <span />}
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </Tag>
  );
}
