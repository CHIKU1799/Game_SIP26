"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@/components/Brand";
import { LEVELS, questionsForLevel } from "@/lib/questions";
import { buildResponseRecord, computeFinalScores } from "@/lib/scoring";
import type {
  Confidence,
  FinalScores,
  Level,
  Question,
  ResponseRecord,
} from "@/lib/types";

const MISLEAD_RATE = parseFloat(
  process.env.NEXT_PUBLIC_AI_MISLEAD_RATE ?? "0.35"
);

type Phase = "transition" | "question" | "complete";

export default function Experiment() {
  const router = useRouter();
  const [pid, setPid] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [order, setOrder] = useState<Level[] | null>(null);

  // progress
  const [li, setLi] = useState(0); // level index within order
  const [qi, setQi] = useState(0); // question index within level
  const [phase, setPhase] = useState<Phase>("transition");

  // per-question answer state
  const [selected, setSelected] = useState<string | null>(null);
  const [openText, setOpenText] = useState("");
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiHintUsed, setAiHintUsed] = useState(false);
  const [aiAnswerUsed, setAiAnswerUsed] = useState(false);
  const startRef = useRef<number>(0);

  const recordsRef = useRef<ResponseRecord[]>([]);
  const [finalScores, setFinalScores] = useState<FinalScores | null>(null);

  // decide which questions get a MISLEADING AI answer (locked per session)
  const misleadSet = useMemo(() => {
    const s = new Set<string>();
    LEVELS.forEach((l) =>
      questionsForLevel(l.key).forEach((q) => {
        if (Math.random() < MISLEAD_RATE) s.add(q.id);
      })
    );
    return s;
  }, []);

  // bootstrap from session
  useEffect(() => {
    const id = sessionStorage.getItem("participant_id");
    const c = sessionStorage.getItem("participant_code") ?? "";
    const ord = sessionStorage.getItem("level_order");
    if (!id || !ord) {
      router.replace("/");
      return;
    }
    setPid(id);
    setCode(c);
    setOrder(JSON.parse(ord));
  }, [router]);

  const level = order?.[li] ?? null;
  const levelMeta = LEVELS.find((l) => l.key === level) ?? LEVELS[0];
  const levelQuestions = level ? questionsForLevel(level) : [];
  const q: Question | null = levelQuestions[qi] ?? null;
  const totalQuestions = (order?.length ?? 5) * 4;
  const answeredCount = li * 4 + qi;

  // run the level-transition overlay
  useEffect(() => {
    if (phase !== "transition") return;
    const t = setTimeout(() => {
      setPhase("question");
      startRef.current = Date.now();
    }, 1700);
    return () => clearTimeout(t);
  }, [phase, li]);

  function resetAnswerState() {
    setSelected(null);
    setOpenText("");
    setConfidence(null);
    setHintOpen(false);
    setAiOpen(false);
    setAiHintUsed(false);
    setAiAnswerUsed(false);
    startRef.current = Date.now();
  }

  function logEvent(type: string, payload?: any) {
    return { type, payload };
  }

  // the AI answer to show for this question (locked by misleadSet)
  const showCorrectAi = q ? !misleadSet.has(q.id) : true;
  const shownAi = q ? (showCorrectAi ? q.aiAnswers[0] : q.aiAnswers[1]) : null;

  async function submit() {
    if (!q || !pid || !confidence) return;
    const rec = buildResponseRecord({
      question: q,
      selectedOption: selected,
      openText,
      confidence,
      aiHintUsed,
      aiAnswerUsed,
      aiAnswerShownCorrect: aiOpen ? showCorrectAi : null,
      aiSuggestedOption: aiOpen ? shownAi?.option ?? null : null,
      timeSpentMs: Date.now() - startRef.current,
    });
    recordsRef.current.push(rec);

    // fire-and-forget persistence (resilient to drop-off)
    fetch("/api/response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant_id: pid,
        record: rec,
        events: [logEvent("question_submit", { id: q.id })],
      }),
    }).catch(() => {});

    advance();
  }

  function advance() {
    if (!order) return;
    if (qi < 3) {
      setQi(qi + 1);
      resetAnswerState();
      return;
    }
    // level finished
    if (li < order.length - 1) {
      setLi(li + 1);
      setQi(0);
      resetAnswerState();
      setPhase("transition");
      return;
    }
    // experiment finished
    const scores = computeFinalScores(recordsRef.current);
    setFinalScores(scores);
    setPhase("complete");
    if (pid) {
      fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: pid, scores }),
      }).catch(() => {});
    }
  }

  if (!order || !pid) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-400">
        Loading arena…
      </div>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <Brand compact />
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-slate-500">
            NeuroCognitive Simulation Arena
          </div>
          <div className="font-mono text-xs text-neon">{code}</div>
        </div>
      </header>

      {/* progress bar */}
      {phase !== "complete" && (
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-[11px] text-slate-400">
            <span>{levelMeta.title}</span>
            <span>
              {answeredCount}/{totalQuestions}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon to-neon2"
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {/* ── LEVEL TRANSITION ── */}
          {phase === "transition" && (
            <motion.div
              key={`t-${li}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 h-px w-40 animate-scan bg-gradient-to-r from-transparent via-neon to-transparent" />
              <div className="chip mx-auto mb-4 border border-neon2/30 bg-neon2/5 text-neon2">
                Level {li + 1} of {order.length}
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {levelMeta.title}
              </h2>
              <p className="mt-3 text-slate-400">{levelMeta.blurb}</p>
              <motion.p
                className="mt-8 font-mono text-sm text-neon"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                {levelMeta.loading}
              </motion.p>
            </motion.div>
          )}

          {/* ── QUESTION ── */}
          {phase === "question" && q && (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="chip border border-neon/25 bg-neon/5 capitalize text-neon">
                  {q.difficulty}
                </span>
                <span className="chip border border-white/10 bg-white/5 capitalize text-slate-300">
                  {q.responseType === "open" ? "Open response" : "Multiple choice"}
                </span>
                {!aiHintUsed && !aiAnswerUsed && (
                  <span className="chip border border-accent/30 bg-accent/5 text-accent">
                    ● Human-only mode
                  </span>
                )}
              </div>

              {/* Context block */}
              <div className="rounded-xl border border-white/8 bg-black/20 p-4 text-sm text-slate-300">
                <div className="mb-1 text-[11px] uppercase tracking-widest text-slate-500">
                  Context
                </div>
                <p className="whitespace-pre-line leading-relaxed">{q.context}</p>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">{q.prompt}</h3>

              {/* Response area */}
              {q.responseType === "mcq" ? (
                <div className="mt-4 space-y-2.5">
                  {q.options!.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => setSelected(o.key)}
                      className={`option-card ${
                        selected === o.key ? "option-selected" : ""
                      }`}
                    >
                      <span className="mr-2 font-mono text-neon">{o.key}.</span>
                      {o.label}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  rows={5}
                  placeholder="Describe your system / reasoning…"
                  className="mt-4 w-full px-4 py-3 text-sm"
                />
              )}

              {/* AI interaction */}
              <div className="mt-5 rounded-xl border border-neon2/20 bg-neon2/5 p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setHintOpen((v) => !v);
                      if (!aiHintUsed) setAiHintUsed(true);
                    }}
                    className="btn-ghost text-sm"
                  >
                    💡 AI Hint
                  </button>
                  <button
                    onClick={() => {
                      setAiOpen(true);
                      setAiAnswerUsed(true);
                    }}
                    className="btn-ghost text-sm"
                  >
                    🤖 Ask AI (full solution)
                  </button>
                  <span className="ml-auto text-[11px] text-slate-500">
                    Using AI is allowed — your usage is part of the study.
                  </span>
                </div>

                <AnimatePresence>
                  {hintOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="rounded-lg border border-warn/20 bg-warn/5 p-3 text-sm text-amber-100/90">
                        <strong className="text-warn">Hint:</strong> {q.hint}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {aiOpen && shownAi && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 overflow-hidden"
                    >
                      <div className="rounded-lg border border-neon/25 bg-neon/5 p-3 text-sm">
                        <div className="mb-1 text-[11px] uppercase tracking-widest text-neon">
                          AI suggested answer
                        </div>
                        <p className="font-semibold text-white">
                          {shownAi.option ? `${shownAi.option}. ` : ""}
                          {shownAi.text}
                        </p>
                        <p className="mt-1 text-slate-300">{shownAi.reason}</p>
                        <p className="mt-2 text-[11px] text-slate-500">
                          The AI can be wrong. The final decision is yours.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confidence */}
              <div className="mt-5">
                <div className="mb-2 text-xs font-medium text-slate-300">
                  How confident are you in your answer?
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as Confidence[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setConfidence(c)}
                      className={`rounded-xl border px-3 py-2.5 text-sm capitalize transition-all ${
                        confidence === c
                          ? "border-neon bg-neon/10 text-white shadow-glow"
                          : "border-white/10 text-slate-300 hover:border-neon/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={submit}
                  disabled={
                    !confidence ||
                    (q.responseType === "mcq" ? !selected : openText.trim().length < 3)
                  }
                  className="btn-primary"
                >
                  {answeredCount === totalQuestions - 1
                    ? "Finish Experiment →"
                    : "Submit & Continue →"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── COMPLETE ── */}
          {phase === "complete" && finalScores && (
            <CompleteScreen code={code} scores={finalScores} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function CompleteScreen({
  code,
  scores,
}: {
  code: string;
  scores: FinalScores;
}) {
  const router = useRouter();
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-8 text-center"
    >
      <div className="text-5xl">🎉</div>
      <h2 className="mt-3 text-3xl font-bold text-white">Experiment Completed</h2>
      <p className="mt-2 text-slate-300">
        Thank you for participating in cognitive research at IIT Madras.
      </p>
      <p className="mt-1 font-mono text-xs text-neon">
        Participant: {code}
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Task Performance" value={`${scores.tps_total}/${scores.tps_max}`} />
        <Stat label="Accuracy" value={`${scores.accuracy_pct}%`} />
        <Stat label="Metacognition (MCS)" value={`${scores.mcs_total}`} />
        <Stat label="AI Usage (AUS)" value={`${scores.aus_total}`} />
        <Stat label="AI Reliance (ARS)" value={`${scores.ars_total}`} />
        <Stat label="Self-Reliance (SRC)" value={`${scores.src}/3`} />
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Your responses have been securely recorded for research analysis.
      </p>
      <button onClick={() => router.push("/")} className="btn-ghost mt-6">
        Exit
      </button>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] text-slate-400">{label}</div>
    </div>
  );
}
