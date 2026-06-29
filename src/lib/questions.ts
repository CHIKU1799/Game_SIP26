import type { Question } from "./types";

// ── Question bank (15 items: 3 per cognitive layer) ─────────────────
// Grounded in CLASSIC, VALIDATED cognitive paradigms so the instrument
// measures real constructs (and so the "misleading AI" variant lands on
// each paradigm's well-known intuitive trap):
//   • Memory       — backward digit span, recognition, paired associates
//                    (context is shown for a timed study window, then HIDDEN)
//   • Analytical   — inverse proportion, successive %, deductive constraint
//   • Creativity   — Guilford Alternative-Uses + Torrance divergent tasks
//   • Perceptual   — odd-one-out, inductive number series, mental rotation
//   • Metacognition— source reliability, calibration, base-rate neglect
//
// Items map to the easy / medium / hard tiers in order.
// aiAnswers[0] = CORRECT/strong AI answer; aiAnswers[1] = MISLEADING/weak
// one (the intuitive trap). The engine decides per-participant which is
// shown when "Ask AI" is pressed (see scoring.ts / experiment flow).

export const QUESTIONS: Question[] = [
  // ───────────────────────── MEMORY ─────────────────────────
  // Every memory item shows its `context` for a timed study window and then
  // HIDES it, so the participant must answer from memory (see experiment flow).
  // Backward digit span (WAIS Digit Span — Backward), 6 digits.
  {
    id: "M1",
    level: "memory",
    difficulty: "easy",
    responseType: "mcq",
    studyMs: 5000,
    context: "Memorise this sequence of digits:\n\n4 – 1 – 8 – 6 – 3 – 9",
    prompt: "Which option shows the SAME digits in REVERSE order?",
    options: [
      { key: "A", label: "9 – 3 – 6 – 8 – 1 – 4" },
      { key: "B", label: "4 – 1 – 8 – 6 – 3 – 9" },
      { key: "C", label: "9 – 3 – 8 – 6 – 1 – 4" },
      { key: "D", label: "9 – 6 – 3 – 8 – 1 – 4" },
    ],
    correctOption: "A",
    hint: "Hold all six digits in mind and read them back-to-front: the last digit (9) becomes the first, the first (4) becomes the last. Don't confuse 'reverse' with the original forward order.",
    aiAnswers: [
      {
        option: "A",
        text: "9 – 3 – 6 – 8 – 1 – 4",
        reason: "Reversing 4‑1‑8‑6‑3‑9 gives 9‑3‑6‑8‑1‑4 — last digit first, first digit last.",
        correct: true,
      },
      {
        option: "B",
        text: "4 – 1 – 8 – 6 – 3 – 9",
        reason: "This is the sequence exactly as shown, which is the most familiar ordering.",
        correct: false,
      },
    ],
  },
  // Recognition memory with a semantic lure — 8-item list (which was NOT shown).
  {
    id: "M2",
    level: "memory",
    difficulty: "medium",
    responseType: "mcq",
    studyMs: 5000,
    context:
      "Study this list of words:\n\nVELVET · COMPASS · THUNDER · ORCHID · MARBLE · FALCON · LANTERN · HARBOUR",
    prompt: "Which of these words did NOT appear in the list?",
    options: [
      { key: "A", label: "ORCHID" },
      { key: "B", label: "CANYON" },
      { key: "C", label: "LANTERN" },
      { key: "D", label: "FALCON" },
    ],
    correctOption: "B",
    hint: "Check each option against the eight studied words. The lure is one that fits the same vivid nature-and-objects theme but was never actually shown.",
    aiAnswers: [
      {
        option: "B",
        text: "CANYON",
        reason: "CANYON never appeared; ORCHID, LANTERN and FALCON were all in the list.",
        correct: true,
      },
      {
        option: "A",
        text: "ORCHID",
        reason: "ORCHID is the most unusual word in the set, so it feels like the one that wasn't there.",
        correct: false,
      },
    ],
  },
  // Paired-associate recall with heavy interference — 5 pairs (cued recall).
  {
    id: "M3",
    level: "memory",
    difficulty: "hard",
    responseType: "mcq",
    studyMs: 6000,
    context:
      "Learn these five word-pairs:\n\n• SILVER → DESERT\n• CASTLE → VIOLIN\n• PEPPER → GLACIER\n• ANCHOR → MEADOW\n• FOREST → DIAMOND",
    prompt: "Which word was paired with PEPPER?",
    options: [
      { key: "A", label: "MEADOW" },
      { key: "B", label: "GLACIER" },
      { key: "C", label: "VIOLIN" },
      { key: "D", label: "DIAMOND" },
    ],
    correctOption: "B",
    hint: "Retrieve the specific partner of PEPPER, not just any studied word. Every distractor is a real response word — but from a different pair.",
    aiAnswers: [
      {
        option: "B",
        text: "GLACIER",
        reason: "PEPPER was paired with GLACIER in the third pair.",
        correct: true,
      },
      {
        option: "A",
        text: "MEADOW",
        reason: "MEADOW is one of the studied response words, so it feels familiar and plausible.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── ANALYTICAL ───────────────────────
  // Each item keeps a strong intuitive trap (so the misleading-AI variant
  // lands), but demands real multi-step reasoning rather than recall.
  // Inverse proportion — resists the "fewer workers ⇒ less time" pull.
  {
    id: "A1",
    level: "analytical",
    difficulty: "easy",
    responseType: "mcq",
    context: "8 painters take 6 hours to paint a wall.\nThey all work at the same steady pace.",
    prompt: "How long would 4 painters take to paint the SAME wall?",
    options: [
      { key: "A", label: "12 hours" },
      { key: "B", label: "3 hours" },
      { key: "C", label: "6 hours" },
      { key: "D", label: "10 hours" },
    ],
    correctOption: "A",
    hint: "The total work is fixed at 8 × 6 = 48 painter-hours. With fewer painters the time goes UP, not down: 48 ÷ 4.",
    aiAnswers: [
      {
        option: "A",
        text: "12 hours",
        reason: "The job is 8 × 6 = 48 painter-hours. With 4 painters: 48 ÷ 4 = 12 hours.",
        correct: true,
      },
      {
        option: "B",
        text: "3 hours",
        reason: "Halving the painters from 8 to 4 should halve the time from 6 hours to 3.",
        correct: false,
      },
    ],
  },
  // Successive percentage change — the "they cancel out" trap.
  {
    id: "A2",
    level: "analytical",
    difficulty: "medium",
    responseType: "mcq",
    context:
      "A jacket's price is first cut by 20% in a sale.\nThe next week, that reduced price is raised by 20%.",
    prompt: "Compared with its ORIGINAL price, the final price is…",
    options: [
      { key: "A", label: "4% lower" },
      { key: "B", label: "Exactly the same" },
      { key: "C", label: "4% higher" },
      { key: "D", label: "20% lower" },
    ],
    correctOption: "A",
    hint: "The two 20%s apply to different amounts. Try ₹100 → −20% = ₹80 → +20% of 80 = ₹96. Equivalently 0.8 × 1.2 = 0.96.",
    aiAnswers: [
      {
        option: "A",
        text: "4% lower",
        reason: "0.8 × 1.2 = 0.96, so the final price is 96% of the original — 4% lower.",
        correct: true,
      },
      {
        option: "B",
        text: "Exactly the same",
        reason: "A 20% drop and a 20% rise are equal and opposite, so they cancel back to the original.",
        correct: false,
      },
    ],
  },
  // Deductive puzzle — mislabelled boxes, single draw (constraint reasoning).
  {
    id: "A3",
    level: "analytical",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "Three sealed boxes are labelled APPLES, ORANGES and MIXED.\nYou are told every one of the three labels is WRONG.\nYou may draw a single fruit from just ONE box, without looking inside.",
    prompt: "From which box should you draw to correctly relabel ALL three?",
    options: [
      { key: "A", label: "The box labelled MIXED" },
      { key: "B", label: "The box labelled APPLES" },
      { key: "C", label: "The box labelled ORANGES" },
      { key: "D", label: "It's impossible from a single draw" },
    ],
    correctOption: "A",
    hint: "Use the fact that every label is wrong. The box labelled MIXED therefore cannot be mixed — it is pure — so one fruit reveals its true type, and that forces the other two.",
    aiAnswers: [
      {
        option: "A",
        text: "The box labelled MIXED",
        reason: "Since every label is wrong, the MIXED box is actually pure. One fruit tells you which pure type it is; the other two boxes are then forced, because their labels are wrong too.",
        correct: true,
      },
      {
        option: "D",
        text: "It's impossible from a single draw",
        reason: "Three unknown boxes from one fruit seems like far too little information to fix all three labels.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── CREATIVITY (open text) ───────────────────────
  // Guilford Alternative Uses Task — divergent thinking (fluency + originality).
  {
    id: "C1",
    level: "creativity",
    difficulty: "easy",
    responseType: "open",
    context: "A common, everyday clay BRICK.",
    prompt:
      "List as many unusual, creative uses for a brick as you can — beyond building. Aim for quantity AND originality.",
    hint: "Both fluency (number of ideas) and originality (how unexpected) count. Push past 'build a wall' — think tool, art, sport, measuring, heating, grinding.",
    aiAnswers: [
      {
        option: null,
        text: "Doorstop, paperweight, bookend, nutcracker, straightedge ruler, plant press, pencil holder (drilled), garden border, exercise weight, or ground into red powder to make paint pigment.",
        reason: "Many varied uses across distinct functions — high fluency and originality.",
        correct: true,
      },
      {
        option: null,
        text: "You can use it to build a wall or a house.",
        reason: "This is the brick's ordinary purpose — neither unusual nor original.",
        correct: false,
      },
    ],
    rubricKeywords: ["paperweight", "doorstop", "weapon", "art", "paint", "pigment", "tool", "weight", "press", "hammer", "nut", "ruler", "heat", "sharpen", "border", "holder", "anchor"],
  },
  // Torrance "Just Suppose" — divergent consequences task.
  {
    id: "C2",
    level: "creativity",
    difficulty: "medium",
    responseType: "open",
    context: "Just suppose that, starting tomorrow, human beings no longer needed to sleep at all.",
    prompt:
      "Describe the most interesting and original consequences this would have. Think beyond the obvious.",
    hint: "Explore second-order ripple effects across society — economy, cities, health, relationships, inequality — not just 'more free time'. Non-obvious consequences score higher.",
    aiAnswers: [
      {
        option: null,
        text: "24-hour economies with no night shift premium; 'night' disappears as a cultural category; new inequality between those who use the extra ~8 hours well and those who don't; cities lit and active around the clock; rising mental strain from never powering down.",
        reason: "Original, multi-domain second-order consequences rather than a single obvious effect.",
        correct: true,
      },
      {
        option: null,
        text: "People would have more time to get their work done.",
        reason: "A single, obvious first-order effect with no originality or depth.",
        correct: false,
      },
    ],
    rubricKeywords: ["economy", "society", "city", "inequality", "health", "culture", "relationship", "productivity", "night", "mental", "shift", "energy", "social", "change", "24"],
  },
  // Torrance Product-Improvement — divergent design task.
  {
    id: "C3",
    level: "creativity",
    difficulty: "hard",
    responseType: "open",
    context: "An ordinary public drinking-water fountain.",
    prompt:
      "Redesign it so that far MORE people actually drink enough water each day. Describe the mechanism that changes behaviour.",
    hint: "Target the behaviour, not just awareness — friction, feedback, incentives, gamification, placement. A mechanism that nudges repeated action beats a one-time reminder.",
    aiAnswers: [
      {
        option: null,
        text: "A tap-in bottle that logs your daily intake on a display, gamified streaks and team leaderboards, on-demand flavour/temperature, and smart placement along high-traffic routes with gentle reminders.",
        reason: "A behaviour-change mechanism (feedback + incentives + placement), not just information.",
        correct: true,
      },
      {
        option: null,
        text: "Put up a sign reminding people to drink more water.",
        reason: "Purely informational; it does not change the decision architecture or behaviour.",
        correct: false,
      },
    ],
    rubricKeywords: ["track", "feedback", "gamif", "incentive", "reward", "reminder", "streak", "placement", "flavour", "temperature", "sensor", "app", "nudge", "friction", "behaviour", "mechanism", "leaderboard"],
  },

  // ─────────────────────── PERCEPTUAL ───────────────────────
  // Odd-one-out categorisation (visual picture tiles).
  {
    id: "P1",
    level: "perceptual",
    difficulty: "easy",
    responseType: "mcq",
    context: "Four food items are shown as picture tiles. Three share a category; one does not.",
    prompt: "Which item does NOT belong with the others?",
    visualOptions: true,
    options: [
      { key: "A", label: "Apple", emoji: "🍎" },
      { key: "B", label: "Banana", emoji: "🍌" },
      { key: "C", label: "Grapes", emoji: "🍇" },
      { key: "D", label: "Carrot", emoji: "🥕" },
    ],
    correctOption: "D",
    hint: "Group by botanical category. Three of these are fruits; one is a vegetable.",
    aiAnswers: [
      {
        option: "D",
        text: "Carrot 🥕",
        reason: "Apple, banana and grapes are fruits; the carrot is a vegetable — the category outlier.",
        correct: true,
      },
      {
        option: "B",
        text: "Banana 🍌",
        reason: "The banana is the only long, non-round item, so it looks like the odd shape out.",
        correct: false,
      },
    ],
  },
  // Inductive number series (growing differences).
  {
    id: "P2",
    level: "perceptual",
    difficulty: "medium",
    responseType: "mcq",
    context: "A number series:\n\n2 · 6 · 12 · 20 · ?",
    prompt: "Which number comes next in the series?",
    options: [
      { key: "A", label: "24" },
      { key: "B", label: "28" },
      { key: "C", label: "30" },
      { key: "D", label: "26" },
    ],
    correctOption: "C",
    hint: "Look at the gaps between terms: +4, +6, +8 … the gap itself grows by 2 each step. So the next gap is +10.",
    aiAnswers: [
      {
        option: "C",
        text: "30",
        reason: "Differences are 4, 6, 8, then 10 → 20 + 10 = 30.",
        correct: true,
      },
      {
        option: "B",
        text: "28",
        reason: "The last visible gap was +8, so adding 8 again gives 28.",
        correct: false,
      },
    ],
  },
  // Mental rotation / pattern continuation (visual arrows).
  {
    id: "P3",
    level: "perceptual",
    difficulty: "hard",
    responseType: "mcq",
    context: "Each arrow rotates 90° CLOCKWISE from the one before it:\n\n⬆️  →  ➡️  →  ⬇️  →  ?",
    prompt: "Which arrow comes next in the rotation?",
    visualOptions: true,
    options: [
      { key: "A", label: "Left", emoji: "⬅️" },
      { key: "B", label: "Up", emoji: "⬆️" },
      { key: "C", label: "Right", emoji: "➡️" },
      { key: "D", label: "Down", emoji: "⬇️" },
    ],
    correctOption: "A",
    hint: "Continue the clockwise turn: up → right → down → … the next 90° clockwise step points left.",
    aiAnswers: [
      {
        option: "A",
        text: "Left ⬅️",
        reason: "Clockwise from down is left (up→right→down→left), continuing the rotation.",
        correct: true,
      },
      {
        option: "B",
        text: "Up ⬆️",
        reason: "After three arrows the pattern seems to loop back to where it started — up.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── METACOGNITION ───────────────────────
  // Evidence-quality / source-reliability judgement.
  {
    id: "MTC1",
    level: "metacognition",
    difficulty: "easy",
    responseType: "mcq",
    context:
      "Two sources disagree about whether a diet works:\n\n• A meta-analysis combining 30 controlled studies\n• One viral social-media testimonial",
    prompt: "Which source is more reliable for a general conclusion?",
    options: [
      { key: "A", label: "The meta-analysis of 30 studies" },
      { key: "B", label: "The viral testimonial" },
      { key: "C", label: "Both are equally reliable" },
      { key: "D", label: "Neither can inform anything" },
    ],
    correctOption: "A",
    hint: "Weigh sample size and control. Aggregated, controlled evidence across many studies beats one vivid personal story.",
    aiAnswers: [
      {
        option: "A",
        text: "The meta-analysis of 30 studies",
        reason: "It pools many controlled studies, reducing bias and sampling noise — far stronger evidence.",
        correct: true,
      },
      {
        option: "B",
        text: "The viral testimonial",
        reason: "A real person sharing real results feels concrete and convincing.",
        correct: false,
      },
    ],
  },
  // Calibration vs outcome bias.
  {
    id: "MTC2",
    level: "metacognition",
    difficulty: "medium",
    responseType: "mcq",
    context:
      "Two forecasters predict tomorrow's weather:\n\n• Forecaster A: “70% chance of rain”\n• Forecaster B: “It will DEFINITELY rain — 100% certain”",
    prompt: "Whose judgement is better CALIBRATED under genuine uncertainty?",
    options: [
      { key: "A", label: "Forecaster A (70%)" },
      { key: "B", label: "Forecaster B (100% certain)" },
      { key: "C", label: "Whoever turns out to be right tomorrow" },
      { key: "D", label: "They are equally well-calibrated" },
    ],
    correctOption: "A",
    hint: "Calibration means stated confidence should match the evidence — and it's judged over many predictions, not by a single outcome. Absolute certainty about an uncertain event is overconfidence.",
    aiAnswers: [
      {
        option: "A",
        text: "Forecaster A (70%)",
        reason: "Expressing proportional uncertainty is well-calibrated; certainty about a chancy event is not.",
        correct: true,
      },
      {
        option: "C",
        text: "Whoever turns out to be right tomorrow",
        reason: "Tomorrow's result will reveal who actually had the better judgement.",
        correct: false,
      },
    ],
  },
  // Base-rate neglect (Bayesian reasoning under a rare condition).
  {
    id: "MTC3",
    level: "metacognition",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "A screening test is 95% accurate.\nThe condition it detects affects only 1 in 1,000 people.\nA randomly chosen person tests POSITIVE.",
    prompt: "Roughly how likely is it that they ACTUALLY have the condition?",
    options: [
      { key: "A", label: "About 95%" },
      { key: "B", label: "About 50%" },
      { key: "C", label: "About 2%" },
      { key: "D", label: "About 80%" },
    ],
    correctOption: "C",
    hint: "Don't ignore the base rate. The condition is rare, so among all positives, false positives vastly outnumber true ones — making the real chance low, not 95%.",
    aiAnswers: [
      {
        option: "C",
        text: "About 2%",
        reason: "Of ~1,000 people, ~1 truly has it (a true positive) while ~50 are false positives — so a positive means roughly a 1-in-50 (≈2%) chance.",
        correct: true,
      },
      {
        option: "A",
        text: "About 95%",
        reason: "The test is 95% accurate, so a positive result should mean about a 95% chance.",
        correct: false,
      },
    ],
  },
];

export const LEVELS: {
  key: import("./types").Level;
  title: string;
  loading: string;
  blurb: string;
  emoji: string; // mascot / illustration glyph for this layer
  color: string; // signature accent (hex) — themes the experiment window
  color2: string; // secondary hue for gradients
}[] = [
  { key: "memory", title: "Memory", loading: "Activating Memory Networks…", blurb: "Working memory & associative recall", emoji: "🧠", color: "#38b6ff", color2: "#5c7cff" },
  { key: "analytical", title: "Analytical Reasoning", loading: "Running Analytical Simulation…", blurb: "Reflective reasoning & logic", emoji: "🧩", color: "#9b6cff", color2: "#6c4cff" },
  { key: "creativity", title: "Creativity", loading: "Engaging Generative Cortex…", blurb: "Divergent thinking & idea generation", emoji: "🎨", color: "#ff5ca8", color2: "#ff8a4c" },
  { key: "perceptual", title: "Perceptual Reasoning", loading: "Calibrating Pattern Sensors…", blurb: "Pattern, sequence & rotation", emoji: "👁️", color: "#00d49a", color2: "#34e1c8" },
  { key: "metacognition", title: "Metacognition", loading: "Initializing Epistemic Monitor…", blurb: "Calibration & evidence evaluation", emoji: "🔍", color: "#ffb547", color2: "#ff7a59" },
];

// 3 items per level (easy / medium / hard).
export const QUESTIONS_PER_LEVEL = 3;

export function questionsForLevel(level: import("./types").Level): Question[] {
  const order = { easy: 0, medium: 1, hard: 2, expert: 3 } as const;
  return QUESTIONS.filter((q) => q.level === level).sort(
    (a, b) => order[a.difficulty] - order[b.difficulty]
  );
}
