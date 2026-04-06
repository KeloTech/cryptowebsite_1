"use client";

import { siteConfig } from "@/data/siteConfig";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Coins,
  Droplets,
  Heart,
  Link2,
  Percent,
  ShieldCheck,
} from "lucide-react";

const icons = {
  coins: Coins,
  droplets: Droplets,
  percent: Percent,
  link: Link2,
  "shield-check": ShieldCheck,
  heart: Heart,
} as const;

function parseBigIntish(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function TokenValue({ value }: { value: string }) {
  const n = parseBigIntish(value);
  const { ref, value: animated } = useCountUp(n ?? 0, 1400);

  if (n === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {animated.toLocaleString()}
      {value.includes("%") ? "%" : ""}
    </span>
  );
}

export function Tokenomics() {
  return (
    <section id="tokenomics" className="relative px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {siteConfig.tokenomics.title}
          </h2>
          <p className="mt-3 text-muted">{siteConfig.tokenomics.subtitle}</p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.tokenomics.items.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <motion.article
                key={item.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -3 }}
                className="group rounded-3xl border border-line bg-gradient-to-br from-white/80 to-white/50 p-6 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted">
                      {item.label}
                    </p>
                    <p className="mt-3 font-display text-2xl font-semibold text-ink">
                      {item.key === "supply" ? (
                        <TokenValue value={item.value} />
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </p>
                    <p
                      className={cn(
                        "mt-2 text-xs text-subtle",
                        "opacity-90 group-hover:opacity-100",
                      )}
                    >
                      {item.hint}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line bg-white/80 p-3 text-accent shadow-sm transition group-hover:shadow-[0_0_24px_-8px_rgba(74,184,201,0.45)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
