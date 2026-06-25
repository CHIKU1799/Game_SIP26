"use client";

import { motion } from "framer-motion";

// Lightweight emoji/particle confetti burst for the completion screen.
// Deterministic layout (index-based) — no Math.random (SSR-safe).
const PIECES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const dist = 120 + (i % 5) * 26;
  const emojis = ["🎉", "✨", "⭐", "🎊", "🐼", "💫", "🌟"];
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist - 40,
    rot: (i % 2 ? 1 : -1) * (120 + (i % 4) * 60),
    emoji: emojis[i % emojis.length],
    delay: (i % 6) * 0.04,
    scale: 0.7 + (i % 4) * 0.18,
  };
});

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-visible">
      {PIECES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.dx,
            y: [0, p.dy, p.dy + 160],
            rotate: p.rot,
            scale: p.scale,
          }}
          transition={{ duration: 1.8, delay: p.delay, ease: "easeOut" }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
