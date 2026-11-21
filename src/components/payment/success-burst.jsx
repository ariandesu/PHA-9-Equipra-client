"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const COLORS = ["#FF6A2B", "#C2410C", "#16A34A", "#FACC15"];
const COUNT = 18;

function useFired() {
  const [fired, setFired] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!firedRef.current) {
      firedRef.current = true;
      setFired(true);
    }
  }, []);

  return fired;
}

export function BurstRings({ screenY }) {
  const reduced = useReducedMotion();
  const fired = useFired();
  const [finished, setFinished] = useState(0);
  const done = finished >= 2;

  if (reduced || !fired || done) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {[0, 1].map((ring) => (
        <div
          key={ring}
          className="absolute left-1/2"
          style={{ top: screenY, translate: "-50% -50%" }}
        >
          <motion.span
            className="block rounded-full border-2 border-[var(--accent)]"
            style={{ width: 90, height: 90 }}
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.9, delay: ring * 0.15, ease: "easeOut" }}
            onAnimationComplete={() => setFinished((n) => n + 1)}
          />
        </div>
      ))}
    </div>
  );
}

// Deterministic layout (no Math.random during render): 6x10px rounded
// rectangles alternate with 6px dots, colours cycling through the set.
function buildPieces() {
  return Array.from({ length: COUNT }, (_, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    return {
      key: i,
      dx: dir * (40 + ((i * 53) % 121)),
      up: 80 + ((i * 37) % 121),
      rot: dir * (90 + ((i * 61) % 271)),
      color: COLORS[i % COLORS.length],
      dot: i % 2 === 1,
      delay: (i % 5) * 0.02,
    };
  });
}

export function BurstConfetti({ slotY }) {
  const reduced = useReducedMotion();
  const [pieces] = useState(buildPieces);
  const fired = useFired();
  const [finished, setFinished] = useState(0);
  const done = finished >= COUNT;

  if (reduced || !fired || done) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 h-0 w-0" style={{ top: slotY }}>
        {pieces.map((p) => (
          <motion.span
            key={p.key}
            className={p.dot ? "absolute rounded-full" : "absolute rounded-[2px]"}
            style={{
              width: 6,
              height: p.dot ? 6 : 10,
              marginLeft: -3,
              marginTop: p.dot ? -3 : -5,
              backgroundColor: p.color,
            }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: [0, p.dx, p.dx],
              y: [0, -p.up, -p.up + 60],
              rotate: [0, p.rot, p.rot],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: p.delay,
              times: [0, 0.45, 1],
              ease: ["easeOut", "easeIn"],
            }}
            onAnimationComplete={() => setFinished((n) => n + 1)}
          />
        ))}
      </div>
    </div>
  );
}
