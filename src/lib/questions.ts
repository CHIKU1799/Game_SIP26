import type { Question } from "./types";

// ── Question bank (20 items: 4 per cognitive layer) ─────────────────
// The 4 items per layer are mapped to the 4 difficulty tiers in order.
// aiAnswers[0] is the CORRECT/strong AI answer; aiAnswers[1] is the
// MISLEADING/weak one. The engine decides per-participant which gets
// shown when "Ask AI" is pressed (see scoring.ts / experiment flow).

export const QUESTIONS: Question[] = [
  // ───────────────────────── MEMORY ─────────────────────────
  {
    id: "M1",
    level: "memory",
    difficulty: "easy",
    responseType: "mcq",
    context:
      "A comparative behavioural dataset reports:\n• Study A: Urban users show higher short-form content recall.\n• Study B: Rural users show higher long-form content retention.\n• Study C: No significant difference in factual recall accuracy across groups.",
    prompt:
      "Which study explicitly supports the absence of a group-level cognitive difference in factual recall?",
    options: [
      { key: "A", label: "Study A" },
      { key: "B", label: "Study B" },
      { key: "C", label: "Study C" },
      { key: "D", label: "None of the above" },
    ],
    correctOption: "C",
    hint: "Focus on statistical null-effect framing. Do not confuse engagement metrics (A, B) with recall accuracy (C). Identify the explicit “no significant difference” statement.",
    aiAnswers: [
      {
        option: "C",
        text: "Study C",
        reason:
          "It explicitly reports no significant difference in factual recall accuracy, which directly indicates absence of a group-level effect.",
        correct: true,
      },
      {
        option: "A",
        text: "Study A",
        reason:
          "Urban users’ higher recall suggests a stronger cognitive difference in at least one population segment.",
        correct: false,
      },
    ],
  },
  {
    id: "M2",
    level: "memory",
    difficulty: "medium",
    responseType: "mcq",
    context:
      "A cognitive-mapping experiment defines:\n• Stability → Predictability\n• Volatility → Change sensitivity\n• Resilience → Recovery after disturbance\n• Drift → Gradual deviation over time",
    prompt: "Which term best corresponds to gradual deviation over time?",
    options: [
      { key: "A", label: "Stability" },
      { key: "B", label: "Volatility" },
      { key: "C", label: "Resilience" },
      { key: "D", label: "Drift" },
    ],
    correctOption: "D",
    hint: "Distinguish between “sudden change response” vs “slow directional shift.” Avoid conflating volatility with drift.",
    aiAnswers: [
      {
        option: "D",
        text: "Drift",
        reason:
          "Drift explicitly encodes gradual, directional change over time without abrupt transitions.",
        correct: true,
      },
      {
        option: "B",
        text: "Volatility",
        reason: "Any change over time can be interpreted as volatility in dynamic systems.",
        correct: false,
      },
    ],
  },
  {
    id: "M3",
    level: "memory",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "A multi-city behavioural survey:\n• City A: high routine adherence, low stress\n• City B: moderate routine adherence, moderate stress\n• City C: low routine adherence, high stress",
    prompt:
      "Which option most strongly reflects the inverse relationship between routine and stress?",
    options: [
      { key: "A", label: "City A only" },
      { key: "B", label: "City B only" },
      { key: "C", label: "Comparison between City A and City C" },
      { key: "D", label: "All three cities show identical patterns" },
    ],
    correctOption: "C",
    hint: "Look for a monotonic inverse pattern alignment across variables, not absolute values.",
    aiAnswers: [
      {
        option: "C",
        text: "City A vs City C comparison",
        reason: "Clear inverse gradient between routine adherence and stress level.",
        correct: true,
      },
      {
        option: "B",
        text: "City B",
        reason: "Midpoint alignment often reflects the most stable system equilibrium.",
        correct: false,
      },
    ],
  },
  {
    id: "M4",
    level: "memory",
    difficulty: "expert",
    responseType: "mcq",
    context:
      "A report states:\n• Dataset X: high variance, low interpretability\n• Dataset Y: low variance, high interpretability\n• Dataset Z: moderate variance, moderate interpretability",
    prompt: "Which dataset is most suitable for generalizable modeling?",
    options: [
      { key: "A", label: "Dataset X" },
      { key: "B", label: "Dataset Y" },
      { key: "C", label: "Dataset Z" },
      { key: "D", label: "Insufficient information to determine" },
    ],
    correctOption: "C",
    hint: "Generalizability depends on the balance between variance and interpretability, not extremity.",
    aiAnswers: [
      {
        option: "C",
        text: "Dataset Z",
        reason: "Moderate variance allows a balance between overfitting and generalization.",
        correct: true,
      },
      {
        option: "A",
        text: "Dataset X",
        reason: "High variance captures broader edge-case behaviour.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── ANALYTICAL ───────────────────────
  {
    id: "A1",
    level: "analytical",
    difficulty: "easy",
    responseType: "mcq",
    context:
      "A study finds: “Increased digital tool usage correlates with higher productivity.”\nAdditional observations:\n• Senior employees use more digital tools.\n• Senior employees already have higher productivity.",
    prompt: "What is the most likely causal interpretation?",
    options: [
      { key: "A", label: "Digital tools directly increase productivity in all employees" },
      { key: "B", label: "Seniority is a confounding variable influencing both tool usage and productivity" },
      { key: "C", label: "Productivity causes employees to adopt more digital tools, with no role for seniority" },
      { key: "D", label: "The observed relationship proves a causal effect of digital tools" },
    ],
    correctOption: "B",
    hint: "Identify whether the variable is a mediator, confounder, or proxy. Focus on hierarchical workplace structure.",
    aiAnswers: [
      {
        option: "B",
        text: "Seniority is a confounding variable",
        reason: "It influences both digital tool usage and productivity independently.",
        correct: true,
      },
      {
        option: "A",
        text: "Digital tools directly increase productivity",
        reason: "Tools inherently improve efficiency regardless of hierarchy.",
        correct: false,
      },
    ],
  },
  {
    id: "A2",
    level: "analytical",
    difficulty: "medium",
    responseType: "mcq",
    context:
      "Policy outcomes:\n• Region A: improvement after intervention\n• Region B: no change\n• Region C: deterioration",
    prompt: "What is the most defensible conclusion?",
    options: [
      { key: "A", label: "The policy is universally effective" },
      { key: "B", label: "The policy is ineffective overall" },
      { key: "C", label: "The policy has context-dependent effects across regions" },
      { key: "D", label: "The data proves the intervention caused deterioration" },
    ],
    correctOption: "C",
    hint: "Avoid averaging outcomes. Look for heterogeneity of treatment effect.",
    aiAnswers: [
      {
        option: "C",
        text: "Context-dependent policy effectiveness",
        reason: "Mixed outcomes indicate non-uniform causal impact.",
        correct: true,
      },
      {
        option: "B",
        text: "Policy is ineffective overall",
        reason: "Any deterioration implies failure.",
        correct: false,
      },
    ],
  },
  {
    id: "A3",
    level: "analytical",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "Observed correlation: “Users with higher app engagement report higher satisfaction.”\nHidden variables considered: social connectivity, personality openness, usage dependency.",
    prompt: "What is the most likely latent driver?",
    options: [
      { key: "A", label: "Social connectivity" },
      { key: "B", label: "App engagement directly causes satisfaction" },
      { key: "C", label: "Usage dependency" },
      { key: "D", label: "Personality openness" },
    ],
    correctOption: "A",
    hint: "Look for the variable that can simultaneously increase engagement and satisfaction without direct causality.",
    aiAnswers: [
      {
        option: "A",
        text: "Social connectivity",
        reason: "Higher connectivity increases both engagement and perceived satisfaction.",
        correct: true,
      },
      {
        option: "B",
        text: "App engagement directly increases satisfaction",
        reason: "Usage reinforces positive feedback loops.",
        correct: false,
      },
    ],
  },
  {
    id: "A4",
    level: "analytical",
    difficulty: "expert",
    responseType: "mcq",
    context:
      "A recommendation model performs well on training data but poorly in new regions.",
    prompt: "What is the primary issue?",
    options: [
      { key: "A", label: "Model under-training" },
      { key: "B", label: "Distribution shift (domain generalization failure)" },
      { key: "C", label: "Excessive model complexity" },
      { key: "D", label: "Random measurement noise" },
    ],
    correctOption: "B",
    hint: "Think domain shift, not just overfitting.",
    aiAnswers: [
      {
        option: "B",
        text: "Distribution shift (domain generalization failure)",
        reason: "Training and deployment environments differ structurally.",
        correct: true,
      },
      {
        option: "A",
        text: "Model under-training",
        reason: "Poor performance always indicates insufficient learning.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── CREATIVITY (open text) ───────────────────────
  {
    id: "C1",
    level: "creativity",
    difficulty: "easy",
    responseType: "open",
    context: "Design a system to reduce overuse of plastic packaging in retail.",
    prompt:
      "Describe your system. Focus on the mechanism that changes behaviour, not just awareness.",
    hint: "Focus on behavioural reinforcement mechanisms (incentives, friction, feedback loops). Avoid purely informational approaches unless they change the decision architecture.",
    aiAnswers: [
      {
        option: null,
        text: "Dynamic pricing penalty system tied to packaging volume with consumer-visible carbon scoring.",
        reason: "Changes the decision architecture at point of purchase via incentives + feedback.",
        correct: true,
      },
      {
        option: null,
        text: "Awareness posters at retail locations.",
        reason: "Purely informational; does not alter the decision architecture.",
        correct: false,
      },
    ],
    rubricKeywords: ["incentive", "pricing", "penalty", "feedback", "score", "reward", "tax", "friction", "deposit", "refund", "system"],
  },
  {
    id: "C2",
    level: "creativity",
    difficulty: "medium",
    responseType: "open",
    context: "Improve human decision-making accuracy in high-pressure environments.",
    prompt: "Propose a system-level intervention, not just more practice.",
    hint: "Think cognitive augmentation: real-time decision support, uncertainty visualization, error correction under stress. Training alone is a slow adaptation mechanism.",
    aiAnswers: [
      {
        option: null,
        text: "AI-assisted decision scaffolding with uncertainty visualization and counterfactual simulation.",
        reason: "Augments cognition in real time rather than relying on slow training adaptation.",
        correct: true,
      },
      {
        option: null,
        text: "More training sessions for workers.",
        reason: "Slow adaptation mechanism; does not support the decision in the moment.",
        correct: false,
      },
    ],
    rubricKeywords: ["real-time", "support", "uncertainty", "visualization", "feedback", "scaffold", "simulation", "augment", "alert", "checklist", "system"],
  },
  {
    id: "C3",
    level: "creativity",
    difficulty: "hard",
    responseType: "open",
    context: "Reduce city congestion without expanding infrastructure.",
    prompt: "Describe a demand-side / control-system approach.",
    hint: "Focus on system-level optimization (demand shaping + real-time routing) rather than structural expansion or behavioural advice alone. Look for feedback-driven control systems.",
    aiAnswers: [
      {
        option: null,
        text: "Predictive mobility routing using real-time demand forecasting and adaptive transport pricing.",
        reason: "A feedback-driven control system that shapes demand without new infrastructure.",
        correct: true,
      },
      {
        option: null,
        text: "Encourage people to travel less.",
        reason: "Behavioural advice with no control mechanism.",
        correct: false,
      },
    ],
    rubricKeywords: ["routing", "real-time", "demand", "pricing", "congestion charge", "forecast", "adaptive", "incentive", "dynamic", "control", "system"],
  },
  {
    id: "C4",
    level: "creativity",
    difficulty: "expert",
    responseType: "open",
    context: "Reduce bureaucratic delay in public services.",
    prompt: "Propose a process-level redesign, not just more staff.",
    hint: "Identify whether inefficiency is process-based or capacity-based. Process optimization (automation, workflow redesign) is typically higher impact than adding manpower.",
    aiAnswers: [
      {
        option: null,
        text: "Process digitization with AI-based document validation and automated workflow routing.",
        reason: "Attacks the process bottleneck rather than throwing capacity at it.",
        correct: true,
      },
      {
        option: null,
        text: "Increase the number of clerks.",
        reason: "Capacity-based fix; leaves the inefficient process intact.",
        correct: false,
      },
    ],
    rubricKeywords: ["digit", "automat", "workflow", "validation", "process", "routing", "online", "self-service", "single window", "redesign", "system"],
  },

  // ─────────────────────── PERCEPTUAL ───────────────────────
  // Spec described this layer as image-based; no images were supplied,
  // so items are rendered as pattern/structure MCQs.
  {
    id: "P1",
    level: "perceptual",
    difficulty: "easy",
    responseType: "mcq",
    context: "Set: Democracy · Monarchy · Republic · Algorithm",
    prompt: "Which item does not belong?",
    options: [
      { key: "A", label: "Democracy" },
      { key: "B", label: "Monarchy" },
      { key: "C", label: "Republic" },
      { key: "D", label: "Algorithm" },
    ],
    correctOption: "D",
    hint: "Identify the ontology mismatch (political system vs computational construct).",
    aiAnswers: [
      {
        option: "D",
        text: "Algorithm",
        reason: "It is a computational procedure, not a governance system.",
        correct: true,
      },
      {
        option: "B",
        text: "Monarchy",
        reason: "It is the least common modern governance structure.",
        correct: false,
      },
    ],
  },
  {
    id: "P2",
    level: "perceptual",
    difficulty: "medium",
    responseType: "mcq",
    context: "Signal pattern: Increase → Stabilize → Overcorrect → Damp → ?",
    prompt: "What completes the sequence?",
    options: [
      { key: "A", label: "Equilibrium convergence" },
      { key: "B", label: "Oscillation increase" },
      { key: "C", label: "System reset" },
      { key: "D", label: "Random divergence" },
    ],
    correctOption: "A",
    hint: "Recognize the system-dynamics cycle (control-systems behaviour).",
    aiAnswers: [
      {
        option: "A",
        text: "Equilibrium convergence",
        reason: "Dampening leads to stabilization.",
        correct: true,
      },
      {
        option: "B",
        text: "Oscillation increase",
        reason: "Systems often re-enter instability after damping.",
        correct: false,
      },
    ],
  },
  {
    id: "P3",
    level: "perceptual",
    difficulty: "hard",
    responseType: "mcq",
    context:
      "Rules:\n• If A increases, B decreases.\n• If B decreases, C increases.\n• If C increases, A decreases.",
    prompt: "What is the nature of this system?",
    options: [
      { key: "A", label: "Independent variable system" },
      { key: "B", label: "Linear cause-effect chain" },
      { key: "C", label: "Closed feedback loop system (negative feedback cycle)" },
      { key: "D", label: "Random stochastic system" },
    ],
    correctOption: "C",
    hint: "Check for closed feedback-loop consistency.",
    aiAnswers: [
      {
        option: "C",
        text: "Negative feedback loop system",
        reason: "Cyclic inhibitory structure maintains equilibrium dynamics.",
        correct: true,
      },
      {
        option: "A",
        text: "Independent variable system",
        reason: "Each variable behaves separately despite links.",
        correct: false,
      },
    ],
  },
  {
    id: "P4",
    level: "perceptual",
    difficulty: "expert",
    responseType: "mcq",
    context: "Items: Whale · Bat · Penguin · Crocodile",
    prompt: "Which classification boundary is most ambiguous?",
    options: [
      { key: "A", label: "Whale" },
      { key: "B", label: "Bat" },
      { key: "C", label: "Penguin" },
      { key: "D", label: "Crocodile" },
    ],
    correctOption: "A",
    hint: "Look for the evolutionary classification mismatch vs intuitive grouping.",
    aiAnswers: [
      {
        option: "A",
        text: "Whale",
        reason: "A mammal adapted to an aquatic environment causes classification ambiguity.",
        correct: true,
      },
      {
        option: "D",
        text: "Crocodile",
        reason: "Reptile lineage creates classification instability in modern taxonomy.",
        correct: false,
      },
    ],
  },

  // ─────────────────────── METACOGNITION ───────────────────────
  {
    id: "MTC1",
    level: "metacognition",
    difficulty: "easy",
    responseType: "mcq",
    context: "Two sources:\n• Meta-analysis of 30 studies\n• Single high-impact experimental study",
    prompt: "Which is more reliable for a general conclusion?",
    options: [
      { key: "A", label: "Meta-analysis of 30 studies" },
      { key: "B", label: "Single high-impact experimental study" },
      { key: "C", label: "Both are equally reliable in all contexts" },
      { key: "D", label: "Neither is suitable for scientific inference" },
    ],
    correctOption: "A",
    hint: "Compare external vs internal validity. Meta-analysis reduces variance across contexts; single experiments increase control precision.",
    aiAnswers: [
      {
        option: "A",
        text: "Meta-analysis",
        reason: "Aggregates multiple datasets, reducing sampling bias.",
        correct: true,
      },
      {
        option: "B",
        text: "Single experimental study",
        reason: "Controlled design gives higher internal validity.",
        correct: false,
      },
    ],
  },
  {
    id: "MTC2",
    level: "metacognition",
    difficulty: "medium",
    responseType: "mcq",
    context:
      "Model outputs:\n• Model A: prediction with a confidence interval\n• Model B: a deterministic prediction",
    prompt: "Which is epistemically stronger?",
    options: [
      { key: "A", label: "Model A" },
      { key: "B", label: "Model B" },
      { key: "C", label: "Both are equally strong but for different use-cases" },
      { key: "D", label: "Cannot be determined without accuracy metrics" },
    ],
    correctOption: "A",
    hint: "Look for calibration and uncertainty quantification. In probabilistic reasoning, explicit uncertainty is a strength, not a weakness.",
    aiAnswers: [
      {
        option: "A",
        text: "Model A",
        reason: "Explicit uncertainty improves calibration and reliability.",
        correct: true,
      },
      {
        option: "B",
        text: "Model B",
        reason: "Deterministic output is easier for decision-making.",
        correct: false,
      },
    ],
  },
  {
    id: "MTC3",
    level: "metacognition",
    difficulty: "hard",
    responseType: "mcq",
    context: "Claim: “Exercise improves cognitive performance.”",
    prompt: "Which statement is most accurate about this claim?",
    options: [
      { key: "A", label: "Fully established direct causal relationship" },
      { key: "B", label: "Partially valid causal claim with mediated pathways" },
      { key: "C", label: "No evidence of any relationship exists" },
      { key: "D", label: "Correlation is irrelevant to cognition" },
    ],
    correctOption: "B",
    hint: "Check whether causality is directly established or mediated through confounders (sleep, stress, neurochemistry, lifestyle clustering).",
    aiAnswers: [
      {
        option: "B",
        text: "Partially valid causal claim",
        reason: "Mediated through physiological and psychological pathways.",
        correct: true,
      },
      {
        option: "A",
        text: "Direct causal relationship fully established",
        reason: "Empirical association is strong enough to conclude causality.",
        correct: false,
      },
    ],
  },
  {
    id: "MTC4",
    level: "metacognition",
    difficulty: "expert",
    responseType: "mcq",
    context:
      "• System A: calibrated probabilistic reasoning\n• System B: absolute deterministic confidence",
    prompt: "Which is more trustworthy?",
    options: [
      { key: "A", label: "System A" },
      { key: "B", label: "System B" },
      { key: "C", label: "Both are equally trustworthy depending on task type" },
      { key: "D", label: "Neither system is reliable" },
    ],
    correctOption: "A",
    hint: "Evaluate epistemic humility vs overconfidence risk. Reliable systems express uncertainty proportional to evidence strength.",
    aiAnswers: [
      {
        option: "A",
        text: "System A",
        reason: "Calibration reflects epistemic humility and robustness.",
        correct: true,
      },
      {
        option: "B",
        text: "System B",
        reason: "High confidence indicates stronger internal certainty.",
        correct: false,
      },
    ],
  },
];

export const LEVELS: { key: import("./types").Level; title: string; loading: string; blurb: string }[] = [
  { key: "memory", title: "Memory", loading: "Activating Memory Networks…", blurb: "Structured retention & recall fidelity" },
  { key: "analytical", title: "Analytical Reasoning", loading: "Running Analytical Simulation…", blurb: "Causal reasoning & structured inference" },
  { key: "creativity", title: "Creativity", loading: "Engaging Generative Cortex…", blurb: "System design & socio-technical reasoning" },
  { key: "perceptual", title: "Perceptual Reasoning", loading: "Calibrating Pattern Sensors…", blurb: "Structure, pattern & logical consistency" },
  { key: "metacognition", title: "Metacognition", loading: "Initializing Epistemic Monitor…", blurb: "Trust evaluation & epistemic reasoning" },
];

export function questionsForLevel(level: import("./types").Level): Question[] {
  const order = { easy: 0, medium: 1, hard: 2, expert: 3 } as const;
  return QUESTIONS.filter((q) => q.level === level).sort(
    (a, b) => order[a.difficulty] - order[b.difficulty]
  );
}
