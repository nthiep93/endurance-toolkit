import type { ReactNode } from "react";
import { cx } from "./cx";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  align?: "left" | "right" | "center";
  /** Use <th scope="row"> for this column's cells. */
  rowHeader?: boolean;
  className?: string;
}

interface ResultTableProps<T> {
  columns: ReadonlyArray<Column<T>>;
  rows: ReadonlyArray<T>;
  rowKey: (row: T, index: number) => string | number;
  caption?: ReactNode;
  /** Visually hide the caption (kept for screen readers). */
  hideCaption?: boolean;
  highlight?: (row: T, index: number) => boolean;
  dense?: boolean;
  className?: string;
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const;

/** Semantic table with horizontal scrolling on narrow screens. */
export function ResultTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  hideCaption,
  highlight,
  dense,
  className,
}: ResultTableProps<T>) {
  const pad = dense ? "px-2.5 py-1.5" : "px-3 py-2.5";
  return (
    <div className={cx("overflow-x-auto rounded-xl border border-line", className)} tabIndex={0} role="region"
      aria-label={typeof caption === "string" ? caption : "Results table"}>
      <table className="w-full border-collapse text-sm tabular">
        {caption ? (
          <caption className={cx("px-3 py-2 text-left text-sm font-medium text-muted", hideCaption && "sr-only")}>
            {caption}
          </caption>
        ) : null}
        <thead className="bg-surface-2">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cx(pad, "whitespace-nowrap font-semibold text-fg", alignClass[c.align ?? "left"], c.className)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const hl = highlight?.(row, i);
            return (
              <tr
                key={rowKey(row, i)}
                className={cx("border-t border-line", hl && "bg-surface-2 font-semibold")}
                aria-current={hl ? "true" : undefined}
              >
                {columns.map((c) => {
                  const cls = cx(pad, "whitespace-nowrap text-fg", alignClass[c.align ?? "left"], c.className);
                  return c.rowHeader ? (
                    <th key={c.key} scope="row" className={cx(cls, "font-medium")}>
                      {c.cell(row, i)}
                    </th>
                  ) : (
                    <td key={c.key} className={cls}>
                      {c.cell(row, i)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
