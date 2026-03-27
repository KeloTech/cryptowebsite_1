"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

type MobileMotionProviderProps = {
  children: ReactNode;
};

export function MobileMotionProvider({ children }: MobileMotionProviderProps) {
  const [disableMotion, setDisableMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setDisableMotion(event.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <MotionConfig
      reducedMotion={disableMotion ? "always" : "never"}
      transition={disableMotion ? { duration: 0, delay: 0 } : undefined}
    >
      {children}
    </MotionConfig>
  );
}
