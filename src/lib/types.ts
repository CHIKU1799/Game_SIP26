// ── Shared domain types ─────────────────────────────────────────────

export type Level =
  | "memory"
  | "analytical"
  | "creativity"
  | "perceptual"
  | "metacognition";

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type ResponseType = "mcq" | "open"; // perceptual uses mcq (no images supplied)

export type Confidence = "low" | "medium" | "high";

export interface AiAnswer {
  // Which option letter this AI answer points to (null for open/creativity).
  option: string | null;
  text: string;
  reason: string;
  // Whether this AI answer is the correct/strong one.
  correct: boolean;
}

export interface Option {
  key: string;
  label: string;
  // Optional visual for image-style MCQ options. `emoji` renders a large
  // glyph; `image` (a /public path or URL) renders an <img>. When either is
  // set, the option card switches to an image-tile layout.
  emoji?: string;
  image?: string;
}

export interface Question {
  id: string; // e.g. "M1"
  level: Level;
  difficulty: Difficulty;
  responseType: ResponseType;
  context: string; // dataset / scenario / claim
  prompt: string;
  options?: Option[]; // for mcq
  // When true, options carry emoji/image and render as a visual tile grid.
  visualOptions?: boolean;
  correctOption?: string; // for mcq
  hint: string;
  // aiAnswers[0] = correct/strong, aiAnswers[1] = misleading/weak.
  aiAnswers: AiAnswer[];
  // For creativity: keywords that indicate a strong systemic answer.
  rubricKeywords?: string[];
}

export interface Demographics {
  age: string;
  gender: string;
  profession: string;
}

// One answered question as captured client-side and sent to the server.
export interface ResponseRecord {
  question_id: string;
  level: Level;
  difficulty: Difficulty;
  response_type: ResponseType;
  selected_option: string | null; // mcq letter
  open_text: string | null; // creativity
  correct_option: string | null;
  is_correct: boolean | null; // null for creativity until rated
  confidence: Confidence;
  // AI interaction
  ai_hint_used: boolean;
  ai_answer_used: boolean;
  ai_answer_shown_correct: boolean | null; // which AI version was shown
  ai_suggested_option: string | null; // option the shown AI pointed to
  // scores
  tps: number;
  aus: number;
  ars: number;
  waas: number;
  mcs: number;
  creativity_band: "high" | "medium" | "low" | null;
  creativity_auto_scored: boolean;
  time_spent_ms: number;
}

export interface FinalScores {
  tps_total: number;
  tps_max: number;
  accuracy_pct: number;
  aus_total: number;
  ars_total: number;
  waas_total: number;
  mcs_total: number;
  src: number; // 0..3 self-reliance bucket
  human_only_pct: number;
  // ── timing ──
  total_active_ms: number; // Σ per-question answering time (client-measured)
  avg_question_ms: number; // mean per-question time
}
