"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function MemeGame() {
  const url = siteConfig.game.embedUrl;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const t = window.setTimeout(() => setLoaded(true), 8000);
    return () => window.clearTimeout(t);
  }, [failed, loaded]);

  const openTab = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <section id="game" className="relative overflow-x-hidden py-16">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-40 bg-gradient-to-b from-accent/10 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        className="relative mx-auto w-full max-w-[1680px] px-3 sm:px-5"
      >
        <div
          className={cn(
            "rounded-2xl p-[1px] sm:rounded-[1.75rem]",
            "bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-accent-lime/70 via-accent-lime/45 to-accent/35",
          )}
        >
          <div className="overflow-hidden rounded-[1.55rem] border border-accent-lime/60 bg-white/50 shadow-[0_24px_60px_-40px_rgba(26,64,58,0.2)] backdrop-blur-sm sm:rounded-[1.7rem]">
            {!failed ? (
              <div className="relative aspect-[12/5] w-full bg-[#c5e8d4]">
                {!loaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/95 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 text-sm text-muted">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
                      Loading arcade…
                    </div>
                  </div>
                )}
                <iframe
                  title="Meme coin mini game"
                  src={url}
                  className="absolute inset-0 h-full w-full border-0 bg-[#c5e8d4]"
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  allow="fullscreen; gamepad"
                  onLoad={() => setLoaded(true)}
                  onError={() => setFailed(true)}
                />
              </div>
            ) : (
              <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-white/90 to-surface p-8 text-center aspect-[12/5]">
                <Gamepad2 className="h-10 w-10 text-accent" />
                <p className="max-w-md text-sm text-muted">
                  The game did not load in time. Check that{" "}
                  <code className="text-ink">public/game/index.html</code> exists
                  and try opening it in a new tab.
                </p>
                <button
                  type="button"
                  onClick={openTab}
                  className="rounded-2xl bg-gradient-to-r from-accent to-accent-cyan px-5 py-3 text-sm font-semibold text-ink shadow-sm"
                >
                  Open Game
                </button>
              </div>
            )}
          </div>
        </div>
        <motion.div
          aria-hidden
          animate={{ rotate: [0, 4, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -right-2 -top-4 hidden h-16 w-16 rounded-2xl bg-accent/20 blur-xl sm:block"
        />
      </motion.div>
    </section>
  );
}
