"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

type MobileMotionProviderProps = {
  children: ReactNode;
};

export function MobileMotionProvider({ children }: MobileMotionProviderProps) {
  const [disableMotion, setDisableMotion] = useState(false);

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
    <MotionConfig reducedMotion={disableMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
