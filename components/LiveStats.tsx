"use client";

import { siteConfig } from "@/data/siteConfig";
import { fetchTokenStats } from "@/lib/fetchTokenStats";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Optional “live” stats strip — disabled by default via `siteConfig.liveStats.enabled`.
 * Wire `fetchTokenStats` to your API later; this component is safe to leave off.
 */
export function LiveStats() {
  const cfg = siteConfig.liveStats;
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!cfg.enabled) return;
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const data = await fetchTokenStats(siteConfig.contract.address);
      if (cancelled) return;
      if (!data) setStatus("error");
      else setStatus("idle");
    })();
    return () => {
      cancelled = true;
    };
  }, [cfg.enabled]);

  if (!cfg.enabled) return null;

  return (
    <section aria-label={cfg.title} className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">{cfg.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{cfg.subtitle}</p>
          </div>
          <p className="text-xs text-zinc-600">
            Status: {status === "loading" ? "loading…" : status === "error" ? "API not wired" : "placeholder"}
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cfg.placeholders.map((p) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-line bg-elevated/50 p-4"
            >
              <p className="text-xs text-zinc-500">{p.label}</p>
              <p className="mt-2 font-display text-xl font-semibold text-zinc-200">
                {p.value}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-xs text-zinc-600">
          {/* Hook: replace placeholders by mapping fetchTokenStats() results into cards. */}
        </p>
      </div>
    </section>
  );
}
