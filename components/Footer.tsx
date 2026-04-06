"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const copyright = siteConfig.footer.copyright.replace("{year}", String(year));
  const { scrollYProgress } = useScroll();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
  });

  return (
    <footer className="relative mt-10 border-t border-line px-4 py-14 sm:px-6">
      <motion.div
        className="absolute left-0 top-0 h-0.5 w-full origin-left bg-gradient-to-r from-accent via-accent-hot to-accent-lime"
        style={{ scaleX }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-xl font-bold text-ink">{siteConfig.brand.ticker}</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            {siteConfig.footer.disclaimer}
          </p>
          <p className="mt-6 text-xs text-subtle">{copyright}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-line bg-white/70 px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink"
          >
            X
          </Link>
          <Link
            href={siteConfig.links.telegram}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-line bg-white/70 px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink"
          >
            Telegram
          </Link>
          <Link
            href={siteConfig.links.dexScreener}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-line bg-white/70 px-4 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-ink"
          >
            DexScreener
          </Link>
        </div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={showTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-2xl border border-line bg-white/90 px-4 py-3 text-sm font-semibold text-ink shadow-lg backdrop-blur",
          !showTop && "pointer-events-none",
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
        Top
      </motion.button>
    </footer>
  );
}
