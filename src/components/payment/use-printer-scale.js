"use client";

import { useEffect, useState } from "react";

const MIN_SCALE = 0.6;
const MAX_SCALE = 0.8;
const FALLBACK_SCALE = 0.7;

function computeScale() {
  const byHeight = (window.innerHeight * 0.5) / 740;
  const byWidth = (window.innerWidth - 96) / 250;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.min(byHeight, byWidth)));
}

export function usePrinterScale() {
  const [scale, setScale] = useState(FALLBACK_SCALE);

  useEffect(() => {
    const sync = () => setScale(computeScale());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return scale;
}
