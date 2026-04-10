"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Gamepad2, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type ScreenOrientationExt = ScreenOrientation & {
  lock?: (orientation: "landscape-primary") => Promise<void>;
  unlock?: () => void;
};

function getScreenOrientation(): ScreenOrientationExt | null {
  if (typeof screen === "undefined") return null;
  return screen.orientation as ScreenOrientationExt;
}

export function MemeGame() {
  const url = siteConfig.game.embedUrl;
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mobileFs, setMobileFs] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaded || failed) return;
    const t = window.setTimeout(() => setLoaded(true), 8000);
    return () => window.clearTimeout(t);
  }, [failed, loaded]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(orientation: portrait)");
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!mobileFs) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFs]);

  const openTab = useCallback(() => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  const closeMobileFs = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
    try {
      getScreenOrientation()?.unlock?.();
    } catch {
      /* ignore */
    }
    setMobileFs(false);
  }, []);

  const openMobileFs = useCallback(async () => {
    setMobileFs(true);
    await new Promise((r) => requestAnimationFrame(r));
    const el = shellRef.current;
    if (el?.requestFullscreen) {
      try {
        await el.requestFullscreen();
      } catch {
        /* iOS — overlay still works */
      }
    }
    try {
      await getScreenOrientation()?.lock?.("landscape-primary");
    } catch {
      /* often unsupported on iOS */
    }
  }, []);

  useEffect(() => {
    if (!mobileFs) return;
    const onFsChange = () => {
      if (!document.fullscreenElement && shellRef.current) {
        setMobileFs(false);
        try {
          getScreenOrientation()?.unlock?.();
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [mobileFs]);

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
        {!failed && (
          <div className="mb-3 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => void openMobileFs()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-cyan px-4 py-3 text-sm font-semibold text-ink shadow-md active:scale-[0.98]"
            >
              <Maximize2 className="h-4 w-4 shrink-0" />
              Play full screen (landscape)
            </button>
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl p-[1px] sm:rounded-[1.75rem]",
            "bg-[length:200%_100%] animate-shimmer bg-gradient-to-r from-accent-lime/70 via-accent-lime/45 to-accent/35",
            mobileFs && "max-md:[display:contents]",
          )}
        >
          <div
            className={cn(
              "overflow-hidden rounded-[1.55rem] border border-accent-lime/60 bg-white/50 shadow-[0_24px_60px_-40px_rgba(26,64,58,0.2)] backdrop-blur-sm sm:rounded-[1.7rem]",
              mobileFs && "max-md:[display:contents]",
            )}
          >
            {!failed ? (
              <div
                ref={shellRef}
                className={cn(
                  "flex flex-col bg-[#1a403a]",
                  mobileFs
                    ? "max-md:fixed max-md:inset-0 max-md:z-[200] max-md:h-[100dvh] max-md:w-full max-md:max-w-none max-md:rounded-none"
                    : "relative w-full",
                )}
              >
                {mobileFs && (
                  <div className="flex shrink-0 items-start justify-between gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
                    <p className="max-w-[72%] text-left text-[11px] leading-snug text-white/90">
                      {portrait
                        ? "Playing in rotated landscape mode. Tap the game to focus."
                        : "Tap the game to play."}
                    </p>
                    <button
                      type="button"
                      onClick={() => void closeMobileFs()}
                      className="flex shrink-0 items-center gap-1 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm active:bg-white/25"
                      aria-label="Close full screen game"
                    >
                      <X className="h-4 w-4" />
                      Close
                    </button>
                  </div>
                )}

                <div
                  className={cn(
                    "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#c5e8d4]",
                    mobileFs ? "pt-0 max-md:min-h-0 max-md:flex-1" : "aspect-[12/5] w-full",
                    mobileFs && "max-md:pt-2",
                  )}
                >
                  <div
                    className={cn(
                      "relative bg-[#c5e8d4]",
                      mobileFs &&
                        portrait &&
                        "max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:h-[100dvw] max-md:w-[100dvh] max-md:max-h-[100dvw] max-md:max-w-[100dvh] max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:rotate-90 max-md:origin-center",
                      mobileFs && !portrait && "max-md:h-full max-md:w-full",
                      !mobileFs && "h-full w-full",
                    )}
                  >
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
                </div>
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
