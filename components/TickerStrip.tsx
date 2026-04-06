"use client";

import { siteConfig } from "@/data/siteConfig";

function PhraseLoop({ id }: { id: string }) {
  return (
    <>
      {siteConfig.tickerPhrases.map((phrase) => (
        <span key={`${id}-${phrase}`} className="inline-flex items-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-subtle">
            {phrase}
          </span>
          <span className="mx-8 text-accent/50">·</span>
        </span>
      ))}
    </>
  );
}

export function TickerStrip() {
  return (
    <div className="relative border-y border-line bg-white/45 py-3 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center whitespace-nowrap pr-8">
          <PhraseLoop id="a" />
          <PhraseLoop id="b" />
        </div>
      </div>
    </div>
  );
}
