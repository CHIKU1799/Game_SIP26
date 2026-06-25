"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@/components/Brand";
import { Panda } from "@/components/Panda";
import { LEVELS } from "@/lib/questions";
import { getSound } from "@/lib/sound";
import type { Level } from "@/lib/types";

type Stage = "landing" | "consent" | "onboarding";

const RANDOMISE =
  (process.env.NEXT_PUBLIC_RANDOMISE_LEVEL_ORDER ?? "true") === "true";

function levelOrder(): Level[] {
  const base = LEVELS.map((l) => l.key);
  if (!RANDOMISE) return base;
  const a = [...base];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("landing");
  const [consent, setConsent] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [profession, setProfession] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canStart = age && gender && profession;

  async function initialize() {
    setSubmitting(true);
    setError(null);
    try {
      const order = levelOrder();
      const res = await fetch("/api/participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age,
          gender,
          profession,
          consent_given: true,
          level_order: order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not initialise.");
      sessionStorage.setItem("participant_id", data.id);
      sessionStorage.setItem("participant_code", data.code);
      sessionStorage.setItem("level_order", JSON.stringify(order));
      router.push("/experiment");
    } catch (e: any) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Brand />
        <a href="/admin" className="text-xs text-slate-500 hover:text-neon">
          Researcher access →
        </a>
      </header>

      <div className="flex flex-1 items-center justify-center py-10">
        <AnimatePresence mode="wait">
          {stage === "landing" && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="text-center"
            >
              <div className="mb-2 flex justify-center">
                <Panda mood="wave" size={132} say="Hi! I'm Pip 🐼 Let's play!" />
              </div>
              <div className="chip mx-auto mb-5 border border-neon/30 bg-neon/5 text-neon">
                Behavioural Research Instrument
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Gamified Cognitive
                <br />
                <span className="bg-gradient-to-r from-neon to-neon2 bg-clip-text text-transparent">
                  Research Platform
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-slate-300">
                This instrument studies <strong>cognitive processing</strong>,{" "}
                <strong>AI-assisted reasoning behaviour</strong>, memory and
                analytical skill, <strong>creativity under constraints</strong>,
                and <strong>metacognitive awareness</strong>. Your responses
                contribute to research at the Department of Management Studies,
                IIT Madras.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {LEVELS.map((l, i) => (
                  <motion.div
                    key={l.key}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className="glass rounded-xl px-3 py-4"
                  >
                    <div className="text-2xl">{l.emoji}</div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {l.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {l.blurb}
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => {
                  getSound().unlock(); // start background music on first gesture
                  getSound().play("click");
                  setStage("consent");
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary mt-10"
              >
                Begin Experiment →
              </motion.button>
              <p className="mt-4 text-xs text-slate-500">
                ~6–10 minutes · 15 questions · anonymous · voluntary
              </p>
            </motion.section>
          )}

          {stage === "consent" && (
            <motion.section
              key="consent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass w-full max-w-2xl rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white">
                Informed Consent
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                <p>
                  You are invited to take part in a research study conducted by
                  the Department of Management Studies, IIT Madras. The study
                  examines how people reason, remember, create, and make
                  decisions — and how they interact with AI assistance.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-slate-300">
                  <li>Participation is fully <strong>voluntary</strong>; you may stop at any time.</li>
                  <li>Responses are <strong>anonymous</strong> — we do not collect your name, email, or contact details.</li>
                  <li>We record your answers, response times, AI-help usage, and confidence ratings for research analysis only.</li>
                  <li>Aggregated, de-identified data may be used in academic publications.</li>
                  <li>There are no known risks; there is no payment for participation.</li>
                </ul>
                <p className="text-slate-400">
                  Questions? Contact the DoMS research team at IIT Madras.
                </p>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#38e1ff]"
                />
                <span>
                  I am 18 or older, I have read and understood the above, and I
                  consent to participate.
                </span>
              </label>
              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => setStage("landing")} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={() => setStage("onboarding")}
                  disabled={!consent}
                  className="btn-primary"
                >
                  I Consent — Continue →
                </button>
              </div>
            </motion.section>
          )}

          {stage === "onboarding" && (
            <motion.section
              key="onboarding"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass w-full max-w-md rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white">
                Initialize Cognitive Profile
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Three quick details. No personal identifiers.
              </p>

              <div className="mt-6 space-y-4">
                <Field label="Age group">
                  <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2.5">
                    <option value="">Select…</option>
                    <option>18–24</option>
                    <option>25–34</option>
                    <option>35–44</option>
                    <option>45–54</option>
                    <option>55+</option>
                  </select>
                </Field>
                <Field label="Gender">
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2.5">
                    <option value="">Select…</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Profession / academic role">
                  <select value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-3 py-2.5">
                    <option value="">Select…</option>
                    <option>Undergraduate student</option>
                    <option>Postgraduate student</option>
                    <option>PhD / Research scholar</option>
                    <option>Faculty / Academic</option>
                    <option>Working professional</option>
                    <option>Entrepreneur / Self-employed</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-400">{error}</p>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => setStage("consent")} className="btn-ghost">
                  ← Back
                </button>
                <button
                  onClick={initialize}
                  disabled={!canStart || submitting}
                  className="btn-primary"
                >
                  {submitting ? "Initializing…" : "Initialize Cognitive Profile →"}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="border-t border-white/5 pt-4 text-center text-xs text-slate-600">
        © IIT Madras · Department of Management Studies · Research use only
      </footer>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}
