import type { Question } from "./types";

// ── Question bank (15 items: 3 per cognitive layer) ─────────────────
// Grounded in CLASSIC, VALIDATED cognitive paradigms so the instrument
// measures real constructs (and so the "misleading AI" variant lands on
// each paradigm's well-known intuitive trap):
//   • Memory       — backward digit span, recognition, paired associates
//   • Analytical   — Cognitive Reflection Test (Frederick, 2005)
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
  // Backward digit span (WAIS Digit Span — Backward).
  {
    id: "M1",
    level: "memory",
    difficulty: "easy",
    responseType: "mcq",
    context: "Memorise this sequence of digits:\n\n7 – 2 – 9 – 4 – 6",
    prompt: "Which option shows the SAME digits in REVERSE order?",
    options: [
      { key: "A", label: "6 – 4 – 9 – 2 – 7" },
      { key: "B", label: "7 – 2 – 9 – 4 – 6" },
      { key: "C", label: "6 – 4 – 2 – 9 – 7" },
      { key: "D", label: "4 – 6 – 9 – 2 – 7" },
    ],
    correctOption: "A",
    hint: "Hold the sequence in mind and read it back-to-front: the last digit becomes the first. Don't confuse 'reverse' with the original forward order.",
    aiAnswers: [
      {
        option: "A",
        text: "6 – 4 – 9 – 2 – 7",
        reason: "Reversing 7‑2‑9‑4‑6 gives 6‑4‑9‑2‑7 — last digit first, first digit last.",
        correct: true,
      },
      {
        option: "B",
        text: "7 – 2 – 9 – 4 – 6",
        reason: "This is the sequence exactly as shown, which is the most familiar ordering.",
        correct: false,
      },
    ],
  },
  // Recognition memory (which item was NOT studied).
  {
    id: "M2",
    level: "memory",
    difficulty: "medium",
    responseType: "mcq",
    context: "Study this list for a moment:\n\nMANGO · CHAIR · RIVER · PLANET · TIGER · CLOCK",
    prompt: "Which of these words did NOT appear in the list above?",
    options: [
      { key: "A", label: "RIVER" },
      { key: "B", label: "PLANET" },
      { key: "C", label: "GARDEN" },
      { key: "D", label: "TIGER" },
    ],
    correctOption: "C",
    hint: "Scan the studied list and check each option against it. The lure is a word that 'feels' like it fits the theme but was never shown.",
    aiAnswers: [
      {
        option: "C",
        text: "GARDEN",
        reason: "GARDEN never appeared in the list; the other three (RIVER, PLANET, TIGER) all did.",
        correct: true,
      },
      {
        option: "A",
        text: "RIVER",
        reason: "RIVER is a nature word and easy to mistake as an outsider in the set.",
        correct: false,
      },
    ],
  },
  // Paired-associate recall with interference (cued recall).
  {
    id: "M3",
    level: "memory",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "Learn these four pairs:\n\n• DOCTOR → APPLE\n• WINDOW → TIGER\n• PENCIL → OCEAN\n• GARDEN → ROCKET",
    prompt: "Which word was paired with PENCIL?",
    options: [
      { key: "A", label: "TIGER" },
      { key: "B", label: "OCEAN" },
      { key: "C", label: "ROCKET" },
      { key: "D", label: "APPLE" },
    ],
    correctOption: "B",
    hint: "Retrieve the specific association for PENCIL, not just any word from the set. The distractors are correct answers — but for the wrong cue.",
    aiAnswers: [
      {
        option: "B",
        text: "OCEAN",
        reason: "PENCIL was explicitly paired with OCEAN in the third pair.",
        correct: true,
      },
      {
        option: "A",
        text: "TIGER",
        reason: "TIGER is one of the studied target words, so it feels familiar and plausible.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── ANALYTICAL ───────────────────────
  // Cognitive Reflection Test — Item 1 (bat & ball).
  {
    id: "A1",
    level: "analytical",
    difficulty: "easy",
    responseType: "mcq",
    context: "A cricket bat and a ball cost ₹1.10 in total.\nThe bat costs ₹1.00 more than the ball.",
    prompt: "How much does the BALL cost?",
    options: [
      { key: "A", label: "₹0.10" },
      { key: "B", label: "₹0.05" },
      { key: "C", label: "₹1.00" },
      { key: "D", label: "₹0.15" },
    ],
    correctOption: "B",
    hint: "Resist the first answer that pops up. If the ball were ₹0.10, the bat (₹1 more) would be ₹1.10 and the total ₹1.20. Solve ball + (ball + 1.00) = 1.10.",
    aiAnswers: [
      {
        option: "B",
        text: "₹0.05",
        reason: "Ball = x, bat = x + 1.00, so 2x + 1.00 = 1.10 → x = ₹0.05 (bat ₹1.05).",
        correct: true,
      },
      {
        option: "A",
        text: "₹0.10",
        reason: "₹1.10 minus the ₹1.00 difference leaves ₹0.10 for the ball — the obvious split.",
        correct: false,
      },
    ],
  },
  // Cognitive Reflection Test — Item 2 (widget-making machines).
  {
    id: "A2",
    level: "analytical",
    difficulty: "medium",
    responseType: "mcq",
    context: "It takes 5 machines 5 minutes to make 5 widgets.",
    prompt: "How long would 100 machines take to make 100 widgets?",
    options: [
      { key: "A", label: "100 minutes" },
      { key: "B", label: "20 minutes" },
      { key: "C", label: "5 minutes" },
      { key: "D", label: "1 minute" },
    ],
    correctOption: "C",
    hint: "Find the rate per machine. One machine makes one widget in 5 minutes; machines work in parallel, so adding machines doesn't change the time.",
    aiAnswers: [
      {
        option: "C",
        text: "5 minutes",
        reason: "Each machine makes 1 widget in 5 min. 100 machines make 100 widgets in parallel — still 5 minutes.",
        correct: true,
      },
      {
        option: "A",
        text: "100 minutes",
        reason: "Scaling everything up 20× suggests the time scales up 20× too, to 100 minutes.",
        correct: false,
      },
    ],
  },
  // Cognitive Reflection Test — Item 3 (lily pads / exponential doubling).
  {
    id: "A3",
    level: "analytical",
    difficulty: "hard",
    responseType: "mcq",
    context: "Lily pads on a lake double in area every day.\nIt takes 48 days for the pads to cover the ENTIRE lake.",
    prompt: "On which day was the lake exactly HALF covered?",
    options: [
      { key: "A", label: "Day 24" },
      { key: "B", label: "Day 47" },
      { key: "C", label: "Day 46" },
      { key: "D", label: "Day 12" },
    ],
    correctOption: "B",
    hint: "Work backwards. If the area doubles each day, then the day before it was full it must have been half. Halving doesn't mean halving the number of days.",
    aiAnswers: [
      {
        option: "B",
        text: "Day 47",
        reason: "Doubling means the day before full (day 48) the lake was half-covered — day 47.",
        correct: true,
      },
      {
        option: "A",
        text: "Day 24",
        reason: "Half the lake should take half the time, so day 24 — exactly halfway to day 48.",
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
