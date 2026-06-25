"use client";

import { motion, AnimatePresence } from "framer-motion";

// ── Pip the Panda — full-body inline-SVG mascot ─────────────────────
// Head + torso + two arms + two legs, all animated with framer-motion
// (no image assets). `mood` drives expression AND body movement — most
// notably "walk", which runs a proper alternating arm/leg step cycle.

export type PandaMood =
  | "idle"
  | "happy"
  | "cheer"
  | "think"
  | "wave"
  | "wow"
  | "walk";

const DARK = "#1c2233";
const FUR = "#f4f7ff";

export function Panda({
  mood = "idle",
  size = 130,
  say,
}: {
  mood?: PandaMood;
  size?: number;
  say?: string;
}) {
  const walking = mood === "walk";
  const happyFace = mood === "happy" || mood === "cheer" || walking;
  const greet = mood === "wave" || mood === "cheer";

  // Whole-body bob / hop.
  const bodyAnim =
    mood === "cheer"
      ? { y: [0, -18, 0], rotate: [0, -3, 3, 0] }
      : walking
      ? { y: [0, -4, 0], rotate: [-1.5, 1.5, -1.5] }
      : mood === "wow"
      ? { scale: [1, 1.07, 1] }
      : { y: [0, -6, 0] }; // gentle breathing
  const bodyDur = mood === "cheer" ? 0.55 : walking ? 0.5 : 3.2;

  // Limb swing timing (the actual "moving" feel).
  const stepT = { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const };
  const legBack = walking ? { rotate: [16, -16, 16] } : { rotate: 0 };
  const legFwd = walking ? { rotate: [-16, 16, -16] } : { rotate: 0 };
  const armBack = walking
    ? { rotate: [-20, 20, -20] }
    : mood === "idle"
    ? { rotate: [0, 7, 0] }
    : { rotate: 0 };
  const armFwd = walking
    ? { rotate: [20, -20, 20] }
    : mood === "idle"
    ? { rotate: [0, -7, 0] }
    : { rotate: 0 };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="absolute -top-2 left-1/2 z-20 w-max max-w-[220px] -translate-x-1/2 -translate-y-full rounded-2xl border border-neon/30 bg-panel/95 px-3.5 py-2 text-center text-xs font-medium text-white shadow-glow backdrop-blur"
          >
            {say}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-neon/30 bg-panel/95" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        width={size}
        height={size * 1.42}
        viewBox="0 0 140 200"
        animate={bodyAnim}
        transition={{ duration: bodyDur, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 10px 18px rgba(56,225,255,0.22))" }}
      >
        {/* ── LEGS (behind body) ── */}
        <motion.g animate={legBack} transition={stepT} style={{ originX: "58px", originY: "150px" }}>
          <rect x="49" y="148" width="18" height="40" rx="9" fill={DARK} />
          <ellipse cx="58" cy="188" rx="12" ry="7" fill={DARK} />
          <ellipse cx="58" cy="187" rx="5" ry="3" fill="#2c3550" />
        </motion.g>
        <motion.g animate={legFwd} transition={stepT} style={{ originX: "82px", originY: "150px" }}>
          <rect x="73" y="148" width="18" height="40" rx="9" fill={DARK} />
          <ellipse cx="82" cy="188" rx="12" ry="7" fill={DARK} />
          <ellipse cx="82" cy="187" rx="5" ry="3" fill="#2c3550" />
        </motion.g>

        {/* ── BODY ── */}
        <ellipse cx="70" cy="132" rx="36" ry="40" fill={DARK} />
        <ellipse cx="70" cy="138" rx="24" ry="30" fill={FUR} />

        {/* ── ARMS (front of body) ── */}
        <motion.g animate={armBack} transition={stepT} style={{ originX: "40px", originY: "108px" }}>
          <rect x="31" y="104" width="17" height="44" rx="8.5" fill={DARK} />
          <circle cx="39.5" cy="148" r="9" fill={DARK} />
        </motion.g>
        {greet ? (
          // raised, waving arm
          <motion.g
            animate={{ rotate: [-150, -172, -150] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{ originX: "100px", originY: "108px" }}
          >
            <rect x="92" y="104" width="17" height="44" rx="8.5" fill={DARK} />
            <circle cx="100.5" cy="148" r="9.5" fill={DARK} />
          </motion.g>
        ) : (
          <motion.g animate={armFwd} transition={stepT} style={{ originX: "100px", originY: "108px" }}>
            <rect x="92" y="104" width="17" height="44" rx="8.5" fill={DARK} />
            <circle cx="100.5" cy="148" r="9" fill={DARK} />
          </motion.g>
        )}

        {/* ── EARS (behind head) ── */}
        <circle cx="44" cy="30" r="15" fill={DARK} />
        <circle cx="96" cy="30" r="15" fill={DARK} />
        <circle cx="44" cy="30" r="7" fill="#0d1426" />
        <circle cx="96" cy="30" r="7" fill="#0d1426" />

        {/* ── HEAD ── */}
        <circle cx="70" cy="60" r="40" fill={FUR} />

        {/* eye patches */}
        <motion.g
          animate={mood === "think" ? { rotate: [0, -3, 0] } : { rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ originX: "70px", originY: "60px" }}
        >
          <ellipse cx="54" cy="56" rx="11" ry="14" fill={DARK} transform="rotate(-12 54 56)" />
          <ellipse cx="86" cy="56" rx="11" ry="14" fill={DARK} transform="rotate(12 86 56)" />
        </motion.g>

        {/* eyes */}
        {happyFace ? (
          <>
            <path d="M49 57 q5 -6 10 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M81 57 q5 -6 10 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.93, 0.96, 1] }}
            style={{ originY: "57px" }}
          >
            <circle cx="54" cy="57" r="4.6" fill="#fff" />
            <circle cx="86" cy="57" r="4.6" fill="#fff" />
            <circle cx={mood === "think" ? 55.5 : 54} cy={mood === "think" ? 55 : 58} r="2.3" fill="#0d1426" />
            <circle cx={mood === "think" ? 87.5 : 86} cy={mood === "think" ? 55 : 58} r="2.3" fill="#0d1426" />
          </motion.g>
        )}

        {/* nose */}
        <ellipse cx="70" cy="73" rx="5" ry="3.5" fill={DARK} />

        {/* mouth */}
        {mood === "wow" ? (
          <ellipse cx="70" cy="85" rx="5" ry="6" fill="#e0567a" />
        ) : happyFace ? (
          <path d="M60 81 q10 12 20 0" stroke={DARK} strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M64 82 q6 6 12 0" stroke={DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* cheeks */}
        <circle cx="46" cy="75" r="4" fill="#ffb3c7" opacity="0.7" />
        <circle cx="94" cy="75" r="4" fill="#ffb3c7" opacity="0.7" />
      </motion.svg>
    </div>
  );
}
