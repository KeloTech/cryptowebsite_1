"use client";

import { motion } from "framer-motion";
import { LineChart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const EMBED_SRC =
  "https://dexscreener.com/solana/GexwWEpwZzBM6wqhHrQd2MgVdWAbNGgLxLLHAfEDc1B2?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15";
const OPEN_SRC =
  "https://dexscreener.com/solana/GexwWEpwZzBM6wqhHrQd2MgVdWAbNGgLxLLHAfEDc1B2";

export function DexChart() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const t = window.setTimeout(() => setFailed(true), 12000);
    return () => window.clearTimeout(t);
  }, [failed, loaded]);

  const openChart = useCallback(() => {
    window.open(OPEN_SRC, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <section id="chart" className="relative px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/5 to-transparent blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20">
            <LineChart className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Live Chart
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Powered by DexScreener
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-[9/14] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:aspect-[16/12] lg:aspect-[16/9]"
        >
          {!loaded && !failed && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/80">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
                Loading chart...
              </div>
            </div>
          )}

          <iframe
            src={EMBED_SRC}
            title="DexScreener chart"
            allowFullScreen
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              inset: 0,
              border: 0,
            }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />

          {failed && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-elevated to-ink p-6">
              <div className="max-w-sm text-center">
                <p className="text-sm text-zinc-300">
                  DexScreener embed is slow or blocked in this browser.
                </p>
                <button
                  type="button"
                  onClick={openChart}
                  className="mt-4 rounded-xl bg-gradient-to-r from-accent to-cyan-300 px-4 py-2.5 text-sm font-semibold text-ink"
                >
                  Open Live Chart
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
