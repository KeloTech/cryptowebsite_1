"use client";

import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";

export function Gallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = siteConfig.gallery.items.find((g) => g.id === activeId) ?? null;

  const close = useCallback(() => setActiveId(null), []);

  return (
    <section id="gallery" className="relative px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {siteConfig.gallery.title}
          </h2>
          <p className="mt-3 text-zinc-400">{siteConfig.gallery.subtitle}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {siteConfig.gallery.items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, rotate: -0.5 }}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-3xl border border-line bg-white/[0.03] text-left shadow-lg",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={close}
            aria-label="Close gallery"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-ink shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-contain bg-black"
                  sizes="100vw"
                  priority
                />
              </div>
              <p className="border-t border-white/10 px-4 py-3 text-center text-sm text-zinc-400">
                Replace with your meme art in{" "}
                <code className="text-zinc-300">data/siteConfig.ts</code>
              </p>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
