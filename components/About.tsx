"use client";

import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {siteConfig.about.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-400">
            {siteConfig.about.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {siteConfig.about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-line bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-white">
                {s.value}
              </p>
              <p className="mt-2 text-xs text-zinc-500">*definitely accurate</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
