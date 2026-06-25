# Gamified Cognitive Research Platform — IIT Madras (DoMS)

A scientific behavioural-experiment platform disguised as an immersive cognitive
game. It measures human cognition, AI-dependency behaviour, decision-making,
metacognitive awareness, and creativity — and stores every response in Supabase
for research analysis. Designed to be shared as **one public link** and collect
**300+ responses**.

---

## What's inside

| Part | Route | Purpose |
|------|-------|---------|
| Landing + Consent + Onboarding | `/` | Branding, informed consent, demographics |
| The game ("NeuroCognitive Simulation Arena") | `/experiment` | 5 levels × 4 items, AI hint/answer tracking, confidence capture |
| Admin dashboard | `/admin` | Analytics, filters, CSV/JSON export, creativity rating |

**5 cognitive levels:** Memory · Analytical Reasoning · Creativity (open text) ·
Perceptual Reasoning · Metacognition.

**6 scores per response** (see `src/lib/scoring.ts`): TPS, AUS, ARS, WAAS, MCS, SRC —
implemented exactly per the research spec.

**Experimental manipulation:** on a configurable fraction of questions the
"Ask AI" button shows a *deliberately wrong* answer, so you can measure whether
participants blindly follow incorrect AI (the **WAAS** score).

---

## Setup (15 minutes)

### 1. Create the Supabase project
1. Go to [supabase.com](https://supabase.com) → New project (free tier is fine).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** secret key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configure environment
```bash
cp .env.local.example .env.local
# then edit .env.local and fill in the three values + a strong ADMIN_PASSWORD
```

### 3. Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

### 4. Deploy to Vercel (the shareable link)
1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → New Project → import the repo.
3. Add the four environment variables (same as `.env.local`) in
   **Project → Settings → Environment Variables**.
4. Deploy. Your public link is e.g. `https://your-app.vercel.app` — share it.
5. The admin dashboard is at `https://your-app.vercel.app/admin`.

---

## Configuration knobs (`.env.local`)

| Variable | Meaning |
|----------|---------|
| `NEXT_PUBLIC_AI_MISLEAD_RATE` | 0–1. Fraction of questions whose "Ask AI" answer is the misleading one. `0` = AI always correct. Default `0.35`. |
| `NEXT_PUBLIC_RANDOMISE_LEVEL_ORDER` | `true` counterbalances level order per participant (recommended for clean analysis). |
| `ADMIN_PASSWORD` | Gate for `/admin`. Use something long and random. |

---

## Data model

- **participants** — one row per person: anonymous code, demographics, consent,
  level order, and aggregate scores written on completion.
- **responses** — one row per answered question with all six scores and the AI
  interaction record. Upserted live, so partial drop-offs are still captured.
- **events** — raw telemetry log (consent, submits, completion).

Export from the admin dashboard:
- **CSV** — one row per response joined with demographics (analysis-ready for
  R / SPSS / pandas).
- **JSON** — full nested dump.

---

## Scoring reference (per spec)

- **TPS** Task Performance: correct=1, wrong=0; creativity high=1/med=0.5/low=0.
- **AUS** AI Usage: human-only=0, hint=1, full answer=2.
- **ARS** AI Reliance: ignored=0, partial=1, fully followed=2.
- **WAAS** Wrong-AI Adoption: followed a *misleading* AI answer = 1, else 0.
- **MCS** Metacognitive Calibration: correct+high=2, correct+low=1,
  wrong+high=0, wrong+low=1 (medium interpolated).
- **SRC** Self-Reliance: % of human-only answers → 76–100=3, 51–75=2, 26–50=1, 0–25=0.

---

## Research notes / known design decisions

- **Consent first** — required before any data is collected (ethics-clean).
- **Anonymous** — no name/email/contact collected; each participant gets a code.
- **Perceptual layer** uses image/emoji picture-tile options (`visualOptions: true`
  in `src/lib/questions.ts`). Set an option's `emoji` or `image` (a `/public` path
  or URL) to make any MCQ visual.
- **Creativity** is auto-scored heuristically as a *provisional* band; confirm or
  override each one in the admin "Creativity responses" panel for publishable data.
- 15 items total (3 per level) mapped to easy / medium / hard (`QUESTIONS_PER_LEVEL`
  in `src/lib/questions.ts`). Add more items there to increase statistical power.
- **Audio**: background music + UI sound effects are synthesised at runtime with the
  Web Audio API (`src/lib/sound.ts`) — no audio files are shipped. Music starts on the
  first user gesture ("Begin Experiment"); a floating button (bottom-right) mutes it.
- **Mascot**: "Pip the Panda" (`src/components/Panda.tsx`) is an animated inline SVG
  that reacts across the landing, level transitions, questions, and completion.
