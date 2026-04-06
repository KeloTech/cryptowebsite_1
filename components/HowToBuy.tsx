"use client";

import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";

export function HowToBuy() {
  return (
    <section id="how-to-buy" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {siteConfig.howToBuy.title}
          </h2>
          <p className="mt-3 text-muted">{siteConfig.howToBuy.subtitle}</p>
        </motion.div>

        <ol className="mt-12 grid gap-4 md:grid-cols-2">
          {siteConfig.howToBuy.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="relative overflow-hidden rounded-3xl border border-line bg-white/75 p-6 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/30 to-accent-lime/25 font-display text-sm font-bold text-ink ring-1 ring-line">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/15 blur-3xl" />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
