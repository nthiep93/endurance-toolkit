"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

interface CopyButtonProps {
  /** Text to copy, or a function producing it lazily. Null/empty disables the button. */
  text: string | null | (() => string | null);
  label?: string;
  className?: string;
}

export async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({ text, label = "Copy results", className }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const disabled = typeof text !== "function" && !text;

  async function onClick() {
    const value = typeof text === "function" ? text() : text;
    if (!value) return;
    const ok = await writeClipboard(value);
    setStatus(ok ? "copied" : "error");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <Button variant="secondary" size="sm" onClick={onClick} disabled={disabled} className={className}>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        {status === "copied" ? (
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="6.5" y="6.5" width="10" height="10" rx="2" />
            <path d="M13.5 6.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v7A1.5 1.5 0 0 0 5 13.5h1.5" />
          </>
        )}
      </svg>
      <span aria-live="polite">
        {status === "copied" ? "Copied!" : status === "error" ? "Copy failed" : label}
      </span>
    </Button>
  );
}
