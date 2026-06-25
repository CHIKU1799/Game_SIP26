import type {
  Confidence,
  FinalScores,
  Question,
  ResponseRecord,
} from "./types";

// ── Creativity auto-scoring (provisional; reviewable in admin) ───────
// Heuristic rubric: rewards systemic / mechanism language. A human
// rater should confirm or override in the admin panel.
export function autoScoreCreativity(
  text: string,
  q: Question
): "high" | "medium" | "low" {
  const t = (text || "").toLowerCase().trim();
  if (t.length < 15) return "low";
  const kws = q.rubricKeywords ?? [];
  const hits = kws.filter((k) => t.includes(k.toLowerCase())).length;
  const lengthOk = t.split(/\s+/).length >= 12;
  if (hits >= 3 && lengthOk) return "high";
  if (hits >= 1 || lengthOk) return "medium";
  return "low";
}

const bandToTps = { high: 1, medium: 0.5, low: 0 } as const;

// ── 6.1 TPS — Task Performance Score ────────────────────────────────
export function computeTps(args: {
  responseType: "mcq" | "open";
  isCorrect: boolean | null;
  creativityBand: "high" | "medium" | "low" | null;
}): number {
  if (args.responseType === "open") {
    return args.creativityBand ? bandToTps[args.creativityBand] : 0;
  }
  return args.isCorrect ? 1 : 0;
}

// ── 6.2 AUS — AI Usage Score ────────────────────────────────────────
// Human only = 0, AI hint = 1, AI full answer = 2 (full answer dominates).
export function computeAus(aiHintUsed: boolean, aiAnswerUsed: boolean): number {
  if (aiAnswerUsed) return 2;
  if (aiHintUsed) return 1;
  return 0;
}

// ── 6.3 ARS — AI Reliance Score ─────────────────────────────────────
// Ignored AI = 0, partial use = 1, fully followed = 2.
// Operationalisation:
//  - No AI consulted                                   -> 0
//  - AI consulted but final answer ≠ AI suggestion     -> 1 (partial)
//  - AI full answer used AND final answer = suggestion -> 2 (fully followed)
export function computeArs(args: {
  aiHintUsed: boolean;
  aiAnswerUsed: boolean;
  aiSuggestedOption: string | null;
  selectedOption: string | null;
  responseType: "mcq" | "open";
}): number {
  const consulted = args.aiHintUsed || args.aiAnswerUsed;
  if (!consulted) return 0;
  // Open/creativity: we cannot match an option; treat full-answer use as
  // strong reliance, hint-only as partial.
  if (args.responseType === "open") {
    return args.aiAnswerUsed ? 2 : 1;
  }
  const followed =
    args.aiSuggestedOption != null &&
    args.selectedOption != null &&
    args.aiSuggestedOption === args.selectedOption;
  if (args.aiAnswerUsed && followed) return 2;
  return 1;
}

// ── 6.4 WAAS — Wrong-AI Adoption Score ──────────────────────────────
// Correct AI choice followed = 0, wrong AI reliance = 1.
// = 1 only when the AI shown was MISLEADING and the participant adopted it.
export function computeWaas(args: {
  aiAnswerShownCorrect: boolean | null;
  aiSuggestedOption: string | null;
  selectedOption: string | null;
}): number {
  if (args.aiAnswerShownCorrect === false) {
    const followedWrong =
      args.aiSuggestedOption != null &&
      args.selectedOption != null &&
      args.aiSuggestedOption === args.selectedOption;
    return followedWrong ? 1 : 0;
  }
  return 0;
}

// ── 6.5 MCS — Metacognitive Calibration Score ───────────────────────
// Correct+high = 2, Correct+low = 1, Wrong+high = 0, Wrong+low = 1.
// Medium confidence is interpolated.
export function computeMcs(args: {
  isCorrect: boolean | null; // for creativity, high band => true
  confidence: Confidence;
}): number {
  const correct = args.isCorrect === true;
  const c = args.confidence;
  if (correct) {
    if (c === "high") return 2;
    if (c === "medium") return 1.5;
    return 1; // low
  }
  // wrong
  if (c === "high") return 0;
  if (c === "medium") return 0.5;
  return 1; // wrong + low confidence = good calibration
}

// ── 6.6 SRC — Self-Reliance Classification ──────────────────────────
// Based on the % of questions answered HUMAN-ONLY (no AI consulted).
// 76–100% -> 3, 51–75% -> 2, 26–50% -> 1, 0–25% -> 0.
export function srcBucket(humanOnlyPct: number): number {
  if (humanOnlyPct >= 76) return 3;
  if (humanOnlyPct >= 51) return 2;
  if (humanOnlyPct >= 26) return 1;
  return 0;
}

// ── Aggregate a finished session ────────────────────────────────────
export function computeFinalScores(records: ResponseRecord[]): FinalScores {
  const n = records.length || 1;
  const tps_total = round2(records.reduce((s, r) => s + r.tps, 0));
  const tps_max = records.length; // each item max = 1
  const gradable = records.filter((r) => r.is_correct !== null);
  const correct = gradable.filter((r) => r.is_correct === true).length;
  const accuracy_pct = gradable.length
    ? Math.round((correct / gradable.length) * 100)
    : 0;
  const aus_total = records.reduce((s, r) => s + r.aus, 0);
  const ars_total = records.reduce((s, r) => s + r.ars, 0);
  const waas_total = records.reduce((s, r) => s + r.waas, 0);
  const mcs_total = round2(records.reduce((s, r) => s + r.mcs, 0));
  const humanOnly = records.filter((r) => !r.ai_hint_used && !r.ai_answer_used).length;
  const human_only_pct = Math.round((humanOnly / n) * 100);
  const total_active_ms = records.reduce((s, r) => s + (r.time_spent_ms || 0), 0);
  const avg_question_ms = records.length
    ? Math.round(total_active_ms / records.length)
    : 0;
  return {
    tps_total,
    tps_max,
    accuracy_pct,
    aus_total,
    ars_total,
    waas_total,
    mcs_total,
    src: srcBucket(human_only_pct),
    human_only_pct,
    total_active_ms,
    avg_question_ms,
  };
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

// ── Build a complete ResponseRecord from raw UI state ───────────────
export function buildResponseRecord(args: {
  question: Question;
  selectedOption: string | null;
  openText: string | null;
  confidence: Confidence;
  aiHintUsed: boolean;
  aiAnswerUsed: boolean;
  aiAnswerShownCorrect: boolean | null;
  aiSuggestedOption: string | null;
  timeSpentMs: number;
}): ResponseRecord {
  const q = args.question;
  const isOpen = q.responseType === "open";

  let creativity_band: "high" | "medium" | "low" | null = null;
  let isCorrect: boolean | null;
  if (isOpen) {
    creativity_band = autoScoreCreativity(args.openText ?? "", q);
    // For metacognition coupling, treat a "high" creative answer as correct.
    isCorrect = creativity_band === "high";
  } else {
    isCorrect =
      args.selectedOption != null && args.selectedOption === q.correctOption;
  }

  const tps = computeTps({
    responseType: q.responseType,
    isCorrect,
    creativityBand: creativity_band,
  });
  const aus = computeAus(args.aiHintUsed, args.aiAnswerUsed);
  const ars = computeArs({
    aiHintUsed: args.aiHintUsed,
    aiAnswerUsed: args.aiAnswerUsed,
    aiSuggestedOption: args.aiSuggestedOption,
    selectedOption: args.selectedOption,
    responseType: q.responseType,
  });
  const waas = computeWaas({
    aiAnswerShownCorrect: args.aiAnswerShownCorrect,
    aiSuggestedOption: args.aiSuggestedOption,
    selectedOption: args.selectedOption,
  });
  const mcs = computeMcs({ isCorrect, confidence: args.confidence });

  return {
    question_id: q.id,
    level: q.level,
    difficulty: q.difficulty,
    response_type: q.responseType,
    selected_option: isOpen ? null : args.selectedOption,
    open_text: isOpen ? args.openText ?? "" : null,
    correct_option: q.correctOption ?? null,
    is_correct: isCorrect,
    confidence: args.confidence,
    ai_hint_used: args.aiHintUsed,
    ai_answer_used: args.aiAnswerUsed,
    ai_answer_shown_correct: args.aiAnswerShownCorrect,
    ai_suggested_option: args.aiSuggestedOption,
    tps,
    aus,
    ars,
    waas,
    mcs,
    creativity_band,
    creativity_auto_scored: isOpen,
    time_spent_ms: args.timeSpentMs,
  };
}
