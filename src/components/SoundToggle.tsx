"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSound } from "@/lib/sound";

// Floating mute / unmute control. Persists choice in localStorage and
// reflects the live engine state.
export function SoundToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cog_muted") === "1";
    if (saved) getSound().setMuted(true);
    setMuted(saved);
  }, []);

  function toggle() {
    const s = getSound();
    s.unlock(); // a click is a valid gesture to start audio
    const m = s.toggleMute();
    setMuted(m);
    localStorage.setItem("cog_muted", m ? "1" : "0");
    if (!m) s.play("click");
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      title={muted ? "Sound off — tap to enable music" : "Sound on — tap to mute"}
      className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full border border-neon/40 bg-panel/90 text-lg shadow-glow backdrop-blur"
    >
      {muted ? (
        <span aria-hidden>🔇</span>
      ) : (
        <span className="flex items-end gap-0.5" aria-hidden>
          {[0.5, 1, 0.7].map((h, i) => (
            <motion.span
              key={i}
              className="block w-1 rounded-full bg-neon"
              animate={{ height: [6 * h, 16 * h, 6 * h] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
