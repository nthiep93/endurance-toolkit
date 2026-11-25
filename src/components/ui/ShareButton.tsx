"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { cx } from "./cx";
import { writeClipboard } from "./CopyButton";

interface ShareButtonProps {
  label?: string;
  /** Title passed to the native share sheet (defaults to document.title). */
  title?: string;
  className?: string;
}

/** Keep in sync with URL_STATE_FLUSH_EVENT in components/tools/useUrlState.ts. */
const FLUSH_EVENT = "urlstate:flush";

/**
 * Shares the current page URL (which carries the tool inputs in its query string).
 * Native share sheet when available (mobile), otherwise copies the link to the clipboard.
 */
export function ShareButton({ label = "Share link", title, className }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function flash(next: "copied" | "error") {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  async function onClick() {
    // Land any pending debounced URL update first, so the link matches what's on screen.
    window.dispatchEvent(new Event(FLUSH_EVENT));
    const url = window.location.href;
    const data = { title: title ?? document.title, url };
    if (typeof navigator.share === "function" && (!navigator.canShare || navigator.canShare(data))) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        // User dismissed the sheet → do nothing; any other failure → fall back to copying.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    flash((await writeClipboard(url)) ? "copied" : "error");
  }

  return (
    <Button variant="secondary" size="sm" onClick={onClick} className={cx("no-print", className)}>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        {status === "copied" ? (
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <path d="M8.5 11.5a3 3 0 0 0 4.24 0l2.5-2.5a3 3 0 0 0-4.24-4.24l-.75.75" strokeLinecap="round" />
            <path d="M11.5 8.5a3 3 0 0 0-4.24 0l-2.5 2.5a3 3 0 0 0 4.24 4.24l.75-.75" strokeLinecap="round" />
          </>
        )}
      </svg>
      <span aria-live="polite">
        {status === "copied" ? "Link copied" : status === "error" ? "Copy failed" : label}
      </span>
    </Button>
  );
}
