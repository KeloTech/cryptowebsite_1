"use client";

import { siteConfig } from "@/data/siteConfig";

function PhraseLoop({ id }: { id: string }) {
  return (
    <>
      {siteConfig.tickerPhrases.map((phrase) => (
        <span key={`${id}-${phrase}`} className="inline-flex items-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {phrase}
          </span>
          <span className="mx-8 text-accent/40">·</span>
        </span>
      ))}
    </>
  );
}

export function TickerStrip() {
  return (
    <div className="relative border-y border-white/10 bg-white/[0.02] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee items-center whitespace-nowrap pr-8">
          <PhraseLoop id="a" />
          <PhraseLoop id="b" />
        </div>
      </div>
    </div>
  );
}
