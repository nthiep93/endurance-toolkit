"use client";

import { Button } from "@/components/ui";

/** Prints the page; everything except the pace band carries `no-print`. */
export function PrintButton({ label = "Print pace band" }: { label?: string }) {
  return (
    <Button size="sm" variant="primary" className="no-print" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
