"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function Background() {
  const { scrollYProgress } = useScroll();
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -80]), {
    stiffness: 100,
    damping: 30,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -140]), {
    stiffness: 80,
    damping: 28,
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-grid-fade" />
      <div className="absolute inset-0 bg-noise opacity-[0.35]" />
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-accent/20 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-24 top-[40vh] h-[380px] w-[380px] rounded-full bg-accent-hot/15 blur-[110px]"
      />
      <div className="absolute bottom-0 left-1/2 h-[320px] w-[120%] -translate-x-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
    </div>
  );
}
