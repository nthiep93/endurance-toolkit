import type { ButtonHTMLAttributes } from "react";
import { cx, focusRing } from "./cx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}

const variants = {
  primary: "bg-brand text-brand-fg hover:opacity-90",
  secondary: "border border-line bg-surface text-fg hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-fg",
} as const;

export function Button({ variant = "secondary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "min-h-9 px-3 text-sm" : "min-h-11 px-4 text-sm",
        variants[variant],
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
