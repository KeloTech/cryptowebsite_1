"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Gamepad2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function MemeGame() {
  const url = siteConfig.game.embedUrl;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // If the embedded site blocks iframing (CSP/X-Frame-Options) or just hangs,
  // `onLoad`/`onError` may not fire reliably. This prevents an infinite spinner.
  useEffect(() => {
    if (loaded || failed) return;
    const t = window.setTimeout(() => setFailed(true), 10000);
    return () => window.clearTimeout(t);
  }, [failed, loaded]);

  const openTab = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <section id="game" className="relative px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-gradient-to-b from-accent/5 to-transparent blur-3xl" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Arcade Mode
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {siteConfig.game.sectionTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              {siteConfig.game.body}
            </p>
            <p className="mt-3 text-sm italic text-zinc-500">
              {siteConfig.game.helperLine}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {siteConfig.game.pills.map((p) => (
                <motion.span
                  key={p}
                  whileHover={{ y: -2 }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200"
                >
                  {p}
                </motion.span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                type="button"
                onClick={openTab}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hot to-fuchsia-400 px-5 py-3 text-sm font-semibold text-ink shadow-[0_0_40px_-12px_rgba(255,79,216,0.75)]"
              >
                <Gamepad2 className="h-4 w-4" />
                {siteConfig.game.ctaLabel}
              </motion.button>
              <span className="text-xs text-zinc-500">
                Opens in a new tab · works great on mobile too
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative"
          >
            <div
              className={cn(
                "rounded-[1.75rem] p-[1px]",
                "bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-accent/40 via-accent-hot/50 to-accent-lime/40",
              )}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-elevated shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
              >
                {!failed ? (
                  <>
                    {!loaded && (
                      <div className="mx-auto flex w-full max-w-[480px] aspect-[4/7] items-center justify-center bg-ink">
                        <div className="flex flex-col items-center gap-3 text-sm text-zinc-400">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
                          Loading arcade…
                        </div>
                      </div>
                    )}
                    <iframe
                      title="Meme coin mini game"
                      src={url}
                      className={cn(
                        "mx-auto w-full max-w-[480px] aspect-[4/7] border-0 bg-black",
                        "transition-opacity duration-300",
                        loaded ? "opacity-100" : "opacity-0 pointer-events-none",
                      )}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allow="fullscreen; gamepad"
                      onLoad={() => setLoaded(true)}
                      onError={() => setFailed(true)}
                    />
                  </>
                ) : (
                  <div className="mx-auto flex w-full max-w-[480px] aspect-[4/7] flex-col items-center justify-center gap-4 bg-gradient-to-br from-elevated to-ink p-8 text-center">
                    <Gamepad2 className="h-10 w-10 text-accent" />
                    <p className="max-w-sm text-sm text-zinc-400">
                      This browser blocked the embed or the game took too long to
                      load. No stress — open it fresh in a new tab.
                    </p>
                    <button
                      type="button"
                      onClick={openTab}
                      className="rounded-2xl bg-gradient-to-r from-accent to-cyan-300 px-5 py-3 text-sm font-semibold text-ink"
                    >
                      Open Game
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
            <motion.div
              aria-hidden
              animate={{ rotate: [0, 4, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-2xl bg-accent/15 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
