"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn, shortenAddress } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Copy, Flame, Sparkles, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";

const badgeIcons = {
  zap: Zap,
  users: Users,
  sparkles: Sparkles,
  flame: Flame,
} as const;

export function Hero() {
  const [copied, setCopied] = useState(false);
  const address = siteConfig.contract.address;
  const short = shortenAddress(address, 4, 4);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [address]);

  /** public/assets — rename file to match if needed (spaces encoded for URL) */
  const blueslothLogoSrc = encodeURI("/assets/bluesloth logo.png");

  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-semibold text-ink/85 shadow-sm backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {siteConfig.brand.ticker} · {siteConfig.contract.networkLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl"
          >
            {siteConfig.brand.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink/78 sm:text-lg"
          >
            {siteConfig.brand.description}
          </motion.p>

          {siteConfig.demo.active && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-4 flex max-w-xl flex-col gap-2"
            >
              <span className="inline-flex w-fit rounded-full border border-dashed border-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                {siteConfig.demo.ribbon}
              </span>
              <p className="text-sm leading-relaxed text-subtle">
                {siteConfig.demo.heroLine}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={siteConfig.links.buy}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-cyan px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_12px_40px_-12px_rgba(74,184,201,0.55)] sm:w-auto",
                  "animate-pulse-soft",
                )}
              >
                {siteConfig.demo.active ? "Buy (example link)" : "Buy Now"}
              </Link>
            </motion.div>
            <Link
              href="#community"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-2xl border border-line bg-white/70 px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-white sm:w-auto",
              )}
            >
              Join Community
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 rounded-2xl border border-line bg-white/65 p-4 shadow-sm backdrop-blur-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-subtle">
              {siteConfig.demo.active
                ? siteConfig.demo.contractTitle
                : "Contract"}
            </p>
            {siteConfig.demo.active && (
              <p className="mt-1 text-xs leading-snug text-subtle">
                {siteConfig.demo.contractNote}
              </p>
            )}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all font-mono text-sm text-ink sm:text-base">
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{address}</span>
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-accent" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {siteConfig.brand.badges.map((b) => {
              const Icon = badgeIcons[b.icon];
              return (
                <li
                  key={b.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-3 py-1 text-xs text-muted shadow-sm backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {b.label}
                </li>
              );
            })}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative flex min-h-[280px] items-center justify-center sm:min-h-[380px] lg:min-h-[420px]"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-[min(72vw,260px)] w-[min(72vw,260px)] sm:h-[min(50vw,300px)] sm:w-[min(50vw,300px)] lg:h-[340px] lg:w-[340px]"
          >
            <Image
              src={blueslothLogoSrc}
              alt="Bluesloth"
              fill
              priority
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 340px"
              className="object-contain drop-shadow-[0_12px_40px_rgba(26,64,58,0.18)]"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
