"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Panda, type PandaMood } from "./Panda";

// ── Level-advance animation ─────────────────────────────────────────
// A horizontal path with one node per level. The panda WALKS from the
// previous level's node to the current one (legs + arms swinging), then
// stops and cheers as the new level's glyph pops in.

export function PandaJourney({
  levels,
  index,
}: {
  levels: { emoji: string; title: string }[];
  index: number; // current level index (0-based)
}) {
  const n = Math.max(levels.length, 1);
  const pct = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);

  const startIdx = Math.max(0, index - 1);
  const startPct = index === 0 ? pct(0) : pct(startIdx);
  const endPct = pct(index);
  const walkMs = index === 0 ? 900 : 1500;

  const [mood, setMood] = useState<PandaMood>("walk");
  useEffect(() => {
    setMood("walk");
    const t = setTimeout(() => setMood("cheer"), walkMs);
    return () => clearTimeout(t);
  }, [index, walkMs]);

  return (
    <div className="relative mx-auto mb-2 h-32 w-full max-w-md">
      {/* base track */}
      <div className="absolute left-0 right-0 top-[92px] h-1.5 rounded-full bg-white/10" />
      {/* progress fill */}
      <motion.div
        className="absolute left-0 top-[92px] h-1.5 rounded-full bg-gradient-to-r from-neon to-neon2"
        initial={{ width: `${startPct}%` }}
        animate={{ width: `${endPct}%` }}
        transition={{ duration: walkMs / 1000, ease: "easeInOut" }}
      />

      {/* level nodes */}
      {levels.map((l, i) => {
        const done = i < index;
        const current = i === index;
        return (
          <div
            key={i}
            className="absolute top-[92px] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pct(i)}%` }}
          >
            <motion.div
              animate={
                current
                  ? { scale: [1, 1.25, 1], boxShadow: ["0 0 0px #54d3c2", "0 0 18px #54d3c2", "0 0 8px #54d3c2"] }
                  : {}
              }
              transition={{ duration: 1.2, repeat: Infinity }}
              className={`grid h-9 w-9 place-items-center rounded-full border text-base ${
                current
                  ? "border-neon bg-neon/15"
                  : done
                  ? "border-neon2/50 bg-neon2/10"
                  : "border-white/15 bg-white/5 opacity-50"
              }`}
            >
              {l.emoji}
            </motion.div>
          </div>
        );
      })}

      {/* the walking panda, riding along the track */}
      <motion.div
        className="absolute bottom-[20px] z-10"
        style={{ translateX: "-50%" }}
        initial={{ left: `${startPct}%` }}
        animate={{ left: `${endPct}%` }}
        transition={{ duration: walkMs / 1000, ease: "easeInOut" }}
      >
        <Panda mood={mood} size={74} />
      </motion.div>
    </div>
  );
}
