"use client";

import { motion } from "framer-motion";

// Floating neon orbs drifting in the background — pure CSS/motion, cheap.
// Positions are deterministic (no Math.random at render) to avoid SSR
// hydration mismatch.
const ORBS = [
  { x: "8%", y: "20%", s: 220, c: "rgba(124,92,255,0.16)", d: 16 },
  { x: "78%", y: "12%", s: 260, c: "rgba(56,225,255,0.14)", d: 20 },
  { x: "62%", y: "70%", s: 200, c: "rgba(0,255,163,0.10)", d: 18 },
  { x: "18%", y: "78%", s: 180, c: "rgba(56,225,255,0.12)", d: 22 },
  { x: "42%", y: "40%", s: 150, c: "rgba(124,92,255,0.10)", d: 14 },
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
