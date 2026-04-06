"use client";

import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";
import {
  LineChart,
  Send,
  ShoppingBag,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const iconMap = {
  send: Send,
  twitter: Twitter,
  "line-chart": LineChart,
  "shopping-bag": ShoppingBag,
} as const;

const coinImageSrc = encodeURI("/assets/bluesloth coin.png");

export function Community() {
  return (
    <section id="community" className="relative px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,200px)] lg:gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {siteConfig.community.title}
              </h2>
              <p className="mt-3 text-muted">{siteConfig.community.subtitle}</p>
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
                      className="group flex h-full flex-col justify-between rounded-3xl border border-line bg-gradient-to-br from-white/85 to-white/55 p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_0_40px_-20px_rgba(74,184,201,0.35)]"
                    >
                      <div className="flex items-start gap-4">
                        <motion.span
                          whileHover={{ y: -2 }}
                          className="inline-flex rounded-2xl border border-line bg-white/80 p-3 text-accent shadow-sm"
                        >
                          <Icon className="h-5 w-5" />
                        </motion.span>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-ink">
                            {card.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted">{card.reason}</p>
                        </div>
                      </div>
                      <span className="mt-6 text-sm font-semibold text-accent">
                        Open link →
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto flex w-full max-w-[200px] justify-center lg:mx-0 lg:justify-end lg:pt-4"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[200px]"
            >
              <Image
                src={coinImageSrc}
                alt="Bluesloth coin"
                fill
                sizes="200px"
                className="object-contain drop-shadow-[0_10px_28px_rgba(26,64,58,0.15)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
