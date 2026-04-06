"use client";

import { siteConfig } from "@/data/siteConfig";
import { motion } from "framer-motion";
import Image from "next/image";

const runImageSrc = encodeURI("/assets/bluesloth run.png");

export function About() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto flex w-full max-w-[200px] justify-center lg:mx-0 lg:justify-start lg:pt-2"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[180px] sm:max-w-[200px] lg:max-w-[200px]"
            >
              <Image
                src={runImageSrc}
                alt="Bluesloth"
                fill
                sizes="200px"
                className="object-contain drop-shadow-[0_10px_28px_rgba(26,64,58,0.15)]"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {siteConfig.about.title}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              {siteConfig.about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {siteConfig.about.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-line bg-white/70 p-6 shadow-sm backdrop-blur-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                {s.label}
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-ink">
                {s.value}
              </p>
              <p className="mt-2 text-xs text-subtle">*jungle certified</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
