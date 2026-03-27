"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn, shortenAddress } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
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

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(124,247,255,0.16), transparent 55%)`;

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

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
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {siteConfig.brand.ticker} · {siteConfig.contract.networkLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {siteConfig.brand.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {siteConfig.brand.description}
          </motion.p>

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
                  "inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-cyan-300 px-6 py-3.5 text-sm font-semibold text-ink shadow-[0_0_40px_-12px_rgba(124,247,255,0.9)] sm:w-auto",
                  "animate-pulse-soft",
                )}
              >
                Buy Now
              </Link>
            </motion.div>
            <Link
              href="#community"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-2xl border border-line bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto",
              )}
            >
              Join Community
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 rounded-2xl border border-line bg-white/[0.03] p-4 shadow-inner"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Contract
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="break-all font-mono text-sm text-zinc-200 sm:text-base">
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{address}</span>
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
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
          onPointerMove={onMove}
          style={{ backgroundImage: spotlight }}
          className="relative isolate min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] sm:min-h-[420px]"
        >
          <div className="absolute inset-0 rounded-[1.85rem] bg-gradient-to-br from-accent/10 via-transparent to-accent-hot/10" />
          <div className="relative flex h-full items-center justify-center p-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[340px]"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-accent/30 via-fuchsia-500/20 to-accent-lime/25 blur-3xl" />
              <div className="relative h-full w-full drop-shadow-2xl">
                <Image
                  src="/assets/snake-coin.png"
                  alt="Snake coin mascot"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 340px"
                  className="object-contain mix-blend-screen"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
