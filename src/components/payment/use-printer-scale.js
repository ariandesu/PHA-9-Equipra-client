"use client";

import { useEffect, useState } from "react";

const MIN_SCALE = 0.85;
const MAX_SCALE = 1;
const FALLBACK_SCALE = 0.9;

function computeScale() {
  const byHeight = (window.innerHeight - 140) / 760;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, byHeight));
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
