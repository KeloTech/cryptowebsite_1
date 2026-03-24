"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#tokenomics", label: "Tokenomics" },
  { href: "#how-to-buy", label: "How to Buy" },
  { href: "#gallery", label: "Gallery" },
  { href: "#community", label: "Community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent transition-colors duration-300",
        scrolled && "border-line bg-ink/75 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="#top"
          className="group flex items-baseline gap-2 font-display text-lg font-bold tracking-tight"
        >
          <span className="rounded-xl bg-white/5 px-2 py-1 text-sm ring-1 ring-white/10 transition group-hover:ring-accent/40">
            {siteConfig.brand.ticker}
          </span>
          <span className="hidden sm:inline text-zinc-400">
            {siteConfig.brand.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-underline relative px-3 py-2 text-sm text-zinc-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="X / Twitter"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href={siteConfig.links.telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Telegram"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.5 4.5 3.5 11c-1.5.6-1.5 1.4-.3 1.8l4.6 1.4 10.7-6.7c.5-.3.9-.1.5.2l-8.7 8-.3 4c.4 0 .6-.2.8-.4l2-2 4.2 3.1c.8.4 1.3.2 1.5-.7l2.7-12.8c.3-1.2-.5-1.8-1.3-1.4z" />
              </svg>
            </Link>
          </div>
          <motion.a
            href={siteConfig.links.buy}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-gradient-to-r from-accent to-cyan-300 px-4 py-2 text-sm font-semibold text-ink shadow-[0_0_30px_-10px_rgba(124,247,255,0.7)]"
          >
            Buy Now
          </motion.a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-xl p-2 text-zinc-200 ring-1 ring-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base text-zinc-200 hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 flex gap-2">
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-2xl border border-line bg-white/5 py-3 text-center text-sm"
                >
                  X
                </a>
                <a
                  href={siteConfig.links.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-2xl border border-line bg-white/5 py-3 text-center text-sm"
                >
                  Telegram
                </a>
                <a
                  href={siteConfig.links.buy}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-[1.3] rounded-2xl bg-gradient-to-r from-accent to-cyan-300 py-3 text-center text-sm font-semibold text-ink"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
