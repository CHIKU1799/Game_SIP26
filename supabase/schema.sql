-- ════════════════════════════════════════════════════════════════════
--  Gamified Cognitive Research Platform — IIT Madras (DoMS)
--  Supabase / Postgres schema
--  Run this in:  Supabase Dashboard → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════════

-- ── Participants ────────────────────────────────────────────────────
create table if not exists participants (
  id               uuid primary key default gen_random_uuid(),
  participant_code text unique not null,         -- anonymous human-readable id
  age              text,
  gender           text,
  profession       text,
  consent_given    boolean not null default false,
  consent_at       timestamptz,
  level_order      jsonb,                         -- counterbalanced level order
  user_agent       text,
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  -- timing (written on completion)
  duration_ms      bigint,                        -- wall-clock: completed_at − started_at (server-computed)
  total_active_ms  bigint,                        -- Σ per-question answering time (client-measured)
  avg_question_ms  bigint,                        -- mean per-question time
  -- aggregate scores (written on completion)
  tps_total        numeric,
  tps_max          int,
  accuracy_pct     int,
  aus_total        int,
  ars_total        int,
  waas_total       int,
  mcs_total        numeric,
  src              int,
  human_only_pct   int
);

-- ── Per-question responses ──────────────────────────────────────────
create table if not exists responses (
  id                       uuid primary key default gen_random_uuid(),
  participant_id           uuid not null references participants(id) on delete cascade,
  question_id              text not null,
  level                    text not null,
  difficulty               text not null,
  response_type            text not null,        -- 'mcq' | 'open'
  selected_option          text,
  open_text                text,
  correct_option           text,
  is_correct               boolean,              -- null for ungraded creativity
  confidence               text,                 -- 'low' | 'medium' | 'high'
  ai_hint_used             boolean default false,
  ai_answer_used           boolean default false,
  ai_answer_shown_correct  boolean,              -- which AI version was shown
  ai_suggested_option      text,
  tps                      numeric,
  aus                      int,
  ars                      int,
  waas                     int,
  mcs                      numeric,
  creativity_band          text,                 -- 'high'|'medium'|'low'|null
  creativity_auto_scored   boolean default false,
  creativity_manual_band   text,                 -- human override in admin
  time_spent_ms            int,
  created_at               timestamptz not null default now(),
  unique (participant_id, question_id)
);

-- ── Raw event log (telemetry) ───────────────────────────────────────
create table if not exists events (
  id              bigserial primary key,
  participant_id  uuid references participants(id) on delete cascade,
  event_type      text not null,                 -- 'level_start','hint_open','ai_answer_open','answer_select','question_submit','complete'
  payload         jsonb,
  created_at      timestamptz not null default now()
);

-- ── Migrations for existing installs (safe to re-run) ───────────────
-- If the participants table already existed before timing was added,
-- these add the new columns without dropping data.
alter table participants add column if not exists duration_ms     bigint;
alter table participants add column if not exists total_active_ms bigint;
alter table participants add column if not exists avg_question_ms bigint;

create index if not exists idx_responses_participant on responses(participant_id);
create index if not exists idx_responses_level on responses(level);
create index if not exists idx_events_participant on events(participant_id);
create index if not exists idx_participants_completed on participants(completed_at);

-- ── Row Level Security ──────────────────────────────────────────────
-- All reads/writes go through server API routes using the service-role
-- key (which bypasses RLS). We enable RLS with NO anon policies so the
-- public anon key cannot read or write participant data directly.
alter table participants enable row level security;
alter table responses    enable row level security;
alter table events       enable row level security;

-- ── Convenience view for the admin dashboard ────────────────────────
create or replace view completed_sessions as
  select * from participants where completed_at is not null;
