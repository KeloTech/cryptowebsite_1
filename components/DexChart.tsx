"use client";

import { motion } from "framer-motion";
import { LineChart } from "lucide-react";

const EMBED_SRC =
  "https://dexscreener.com/solana/GexwWEpwZzBM6wqhHrQd2MgVdWAbNGgLxLLHAfEDc1B2?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15";

export function DexChart() {
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
          className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
          style={{ position: "relative", width: "100%", paddingBottom: "65%" }}
        >
          <iframe
            src={EMBED_SRC}
            title="DexScreener chart"
            allowFullScreen
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: 0,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
