"use client";

import { motion } from "framer-motion";

// Floating neon orbs drifting in the background — pure CSS/motion, cheap.
// Positions are deterministic (no Math.random at render) to avoid SSR
// hydration mismatch.
const ORBS = [
  { x: "6%", y: "18%", s: 300, c: "rgba(138,125,242,0.13)", d: 26 },
  { x: "80%", y: "10%", s: 340, c: "rgba(84,211,194,0.11)", d: 30 },
  { x: "64%", y: "72%", s: 280, c: "rgba(244,134,168,0.08)", d: 28 },
  { x: "16%", y: "80%", s: 240, c: "rgba(84,211,194,0.10)", d: 32 },
  { x: "44%", y: "42%", s: 200, c: "rgba(138,125,242,0.08)", d: 24 },
];

export function Particles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: o.x,
            top: o.y,
            width: o.s,
            height: o.s,
            background: o.c,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -28, 18, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
