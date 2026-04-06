import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-accent-cyan text-ink shadow-[0_10px_36px_-10px_rgba(74,184,201,0.5)] hover:shadow-[0_12px_40px_-8px_rgba(74,184,201,0.55)]",
  secondary:
    "border border-line bg-white/75 text-ink shadow-sm hover:bg-white hover:border-accent/30",
  ghost: "text-muted hover:text-ink hover:bg-white/60",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-transform duration-200 will-change-transform hover:-translate-y-0.5 active:translate-y-0",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
