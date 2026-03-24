"use client";

import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";
import {
  LineChart,
  Send,
  ShoppingBag,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const iconMap = {
  send: Send,
  twitter: Twitter,
  "line-chart": LineChart,
  "shopping-bag": ShoppingBag,
} as const;

export function Community() {
  return (
    <section id="community" className="relative px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {siteConfig.community.title}
          </h2>
          <p className="mt-3 text-zinc-400">{siteConfig.community.subtitle}</p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {siteConfig.community.cards.map((card, i) => {
            const href = siteConfig.links[card.hrefKey];
            const Icon = iconMap[card.icon];
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-gradient-to-br from-white/[0.05] to-transparent p-6 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_0_40px_-20px_rgba(124,247,255,0.35)]"
                >
                  <div className="flex items-start gap-4">
                    <motion.span
                      whileHover={{ y: -2 }}
                      className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-accent"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {card.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">{card.reason}</p>
                    </div>
                  </div>
                  <span className="mt-6 text-sm font-semibold text-accent/90">
                    Open link →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
