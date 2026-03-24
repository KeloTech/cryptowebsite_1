import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent to-cyan-300 text-ink shadow-[0_0_40px_-10px_rgba(124,247,255,0.8)] hover:shadow-[0_0_50px_-8px_rgba(124,247,255,0.95)]",
  secondary:
    "border border-line bg-white/5 text-white hover:bg-white/10 hover:border-white/20",
  ghost: "text-zinc-300 hover:text-white hover:bg-white/5",
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
