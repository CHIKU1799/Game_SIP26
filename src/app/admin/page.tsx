"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Brand } from "@/components/Brand";
import { LEVELS } from "@/lib/questions";

type Participant = any;
type ResponseRow = any;

// ms → "Xm Ys" (blank when unknown)
function fmtMs(ms: any): string {
  if (ms == null || isNaN(Number(ms))) return "—";
  const s = Math.round(Number(ms) / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
}

export default function Admin() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [responses, setResponses] = useState<ResponseRow[]>([]);

  // filters
  const [fAge, setFAge] = useState("");
  const [fGender, setFGender] = useState("");
  const [fProf, setFProf] = useState("");
  const [fTier, setFTier] = useState("");
  const [fAi, setFAi] = useState("");

  async function load(password: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/data", {
        headers: { "x-admin-password": password },
      });
      if (res.status === 401) throw new Error("Wrong password.");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed.");
      setParticipants(data.participants);
      setResponses(data.responses);
      setAuthed(true);
      sessionStorage.setItem("admin_pw", password);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setPw(saved);
      load(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── apply participant-level filters ──
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (fAge && p.age !== fAge) return false;
      if (fGender && p.gender !== fGender) return false;
      if (fProf && p.profession !== fProf) return false;
      if (fTier) {
        const acc = p.accuracy_pct ?? 0;
        const tier = acc >= 75 ? "high" : acc >= 50 ? "mid" : "low";
        if (tier !== fTier) return false;
      }
      return true;
    });
  }, [participants, fAge, fGender, fProf, fTier]);

  const pidSet = useMemo(
    () => new Set(filteredParticipants.map((p) => p.id)),
    [filteredParticipants]
  );

  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      if (!pidSet.has(r.participant_id)) return false;
      if (fAi === "human" && (r.ai_hint_used || r.ai_answer_used)) return false;
      if (fAi === "hint" && !r.ai_hint_used) return false;
      if (fAi === "answer" && !r.ai_answer_used) return false;
      return true;
    });
  }, [responses, pidSet, fAi]);

  // ── derived analytics ──
  const completed = filteredParticipants.filter((p) => p.completed_at);
  const avg = (arr: number[]) =>
    arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : 0;

  // avg wall-clock duration over completed sessions that have a recorded time
  const timed = completed.filter((p) => p.duration_ms != null);
  const kpis = {
    total: filteredParticipants.length,
    completed: completed.length,
    avgAcc: avg(completed.map((p) => p.accuracy_pct ?? 0)),
    avgAus: avg(completed.map((p) => p.aus_total ?? 0)),
    avgWaas: avg(completed.map((p) => p.waas_total ?? 0)),
    avgMcs: avg(completed.map((p) => p.mcs_total ?? 0)),
    avgTimeMs: timed.length
      ? Math.round(avg(timed.map((p) => Number(p.duration_ms))))
      : 0,
  };

  // performance by level (avg TPS, 0..1 scaled to %)
  const perfByLevel = LEVELS.map((l) => {
    const rs = filteredResponses.filter((r) => r.level === l.key);
    const tps = rs.map((r) => Number(r.tps ?? 0));
    return { level: l.title, score: Math.round(avg(tps) * 100) };
  });

  // AI dependency distribution (SRC buckets across completed)
  const srcDist = [0, 1, 2, 3].map((b) => ({
    bucket: ["≤25%", "26–50%", "51–75%", "76–100%"][b] + " human-only",
    count: completed.filter((p) => p.src === b).length,
  }));

  // confidence vs accuracy (calibration) — graded responses only
  const graded = filteredResponses.filter((r) => r.is_correct !== null);
  const calib = (["low", "medium", "high"] as const).map((c) => {
    const rs = graded.filter((r) => r.confidence === c);
    const correct = rs.filter((r) => r.is_correct === true).length;
    return {
      confidence: c,
      n: rs.length,
      accuracy: rs.length ? Math.round((correct / rs.length) * 100) : 0,
    };
  });

  // metacognition bias
  const overconfident = graded.filter(
    (r) => r.is_correct === false && r.confidence === "high"
  ).length;
  const underconfident = graded.filter(
    (r) => r.is_correct === true && r.confidence === "low"
  ).length;

  // wrong-AI adoption: among misleading-AI exposures, how often followed
  const misleadShown = filteredResponses.filter(
    (r) => r.ai_answer_shown_correct === false
  );
  const followedWrong = misleadShown.filter((r) => r.waas === 1).length;

  // creativity responses needing review
  const creativity = filteredResponses.filter((r) => r.response_type === "open");

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="glass w-full max-w-sm rounded-2xl p-8">
          <Brand compact />
          <h1 className="mt-6 text-xl font-bold text-white">Researcher Access</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter the admin password to open the research dashboard.
          </p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(pw)}
            placeholder="Admin password"
            className="mt-5 w-full px-3 py-2.5"
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            onClick={() => load(pw)}
            disabled={loading || !pw}
            className="btn-primary mt-4 w-full"
          >
            {loading ? "Authenticating…" : "Open Dashboard"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Brand />
        <div className="flex items-center gap-2">
          <ExportButtons participants={filteredParticipants} responses={filteredResponses} />
          <button
            onClick={() => load(pw)}
            className="btn-ghost text-sm"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <h1 className="mt-6 text-2xl font-bold text-white">
        Research Analytics Dashboard
      </h1>

      {/* Filters */}
      <div className="glass mt-4 grid grid-cols-2 gap-3 rounded-xl p-4 sm:grid-cols-5">
        <FilterSelect label="Age" value={fAge} set={setFAge} options={uniq(participants, "age")} />
        <FilterSelect label="Gender" value={fGender} set={setFGender} options={uniq(participants, "gender")} />
        <FilterSelect label="Profession" value={fProf} set={setFProf} options={uniq(participants, "profession")} />
        <FilterSelect
          label="Performance tier"
          value={fTier}
          set={setFTier}
          options={["high", "mid", "low"]}
        />
        <FilterSelect
          label="AI usage"
          value={fAi}
          set={setFAi}
          options={["human", "hint", "answer"]}
        />
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <Kpi label="Participants" value={kpis.total} />
        <Kpi label="Completed" value={kpis.completed} />
        <Kpi label="Avg accuracy" value={`${kpis.avgAcc}%`} />
        <Kpi label="Avg AI usage" value={kpis.avgAus} />
        <Kpi label="Avg wrong-AI" value={kpis.avgWaas} accent="warn" />
        <Kpi label="Avg MCS" value={kpis.avgMcs} />
        <Kpi label="Avg time" value={fmtMs(kpis.avgTimeMs)} />
      </div>

      {/* Charts row 1 */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Panel title="Cognitive performance by level (avg TPS %)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={perfByLevel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2740" />
              <XAxis dataKey="level" stroke="#7c8aa6" fontSize={11} />
              <YAxis stroke="#7c8aa6" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#38e1ff" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="AI dependency distribution (SRC buckets)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={srcDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2740" />
              <XAxis dataKey="bucket" stroke="#7c8aa6" fontSize={10} />
              <YAxis stroke="#7c8aa6" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#7c5cff" />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Charts row 2 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Confidence vs accuracy (calibration)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={calib}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2740" />
              <XAxis dataKey="confidence" stroke="#7c8aa6" fontSize={11} />
              <YAxis stroke="#7c8aa6" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]} fill="#00ffa3" />
              <Bar dataKey="n" name="# responses" radius={[6, 6, 0, 0]} fill="#2b3b5c" />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-slate-400">
            Well-calibrated participants are more accurate when more confident.
          </p>
        </Panel>

        <Panel title="Metacognition bias & AI trust">
          <div className="grid grid-cols-2 gap-3">
            <MiniStat
              label="Overconfident errors"
              sub="wrong + high confidence"
              value={overconfident}
              tone="warn"
            />
            <MiniStat
              label="Underconfident hits"
              sub="correct + low confidence"
              value={underconfident}
              tone="neon"
            />
            <MiniStat
              label="Misleading AI shown"
              sub="wrong-AI exposures"
              value={misleadShown.length}
              tone="slate"
            />
            <MiniStat
              label="Followed wrong AI"
              sub={`${
                misleadShown.length
                  ? Math.round((followedWrong / misleadShown.length) * 100)
                  : 0
              }% adoption`}
              value={followedWrong}
              tone="warn"
            />
          </div>
        </Panel>
      </div>

      {/* Creativity review */}
      <CreativityReview
        rows={creativity}
        pw={pw}
        onUpdated={() => load(pw)}
      />

      {/* Raw participant table */}
      <Panel title={`Participants (${filteredParticipants.length})`} className="mt-4">
        <div className="max-h-96 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-panel text-slate-400">
              <tr>
                {["Code", "Age", "Gender", "Profession", "Acc%", "AUS", "ARS", "WAAS", "MCS", "SRC", "Time", "Done"].map(
                  (h) => (
                    <th key={h} className="px-2 py-2">{h}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((p) => (
                <tr key={p.id} className="border-t border-white/5 text-slate-200">
                  <td className="px-2 py-1.5 font-mono text-neon">{p.participant_code}</td>
                  <td className="px-2 py-1.5">{p.age}</td>
                  <td className="px-2 py-1.5">{p.gender}</td>
                  <td className="px-2 py-1.5">{p.profession}</td>
                  <td className="px-2 py-1.5">{p.accuracy_pct ?? "—"}</td>
                  <td className="px-2 py-1.5">{p.aus_total ?? "—"}</td>
                  <td className="px-2 py-1.5">{p.ars_total ?? "—"}</td>
                  <td className="px-2 py-1.5">{p.waas_total ?? "—"}</td>
                  <td className="px-2 py-1.5">{p.mcs_total ?? "—"}</td>
                  <td className="px-2 py-1.5">{p.src ?? "—"}</td>
                  <td className="px-2 py-1.5">{fmtMs(p.duration_ms)}</td>
                  <td className="px-2 py-1.5">{p.completed_at ? "✓" : "·"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </main>
  );
}

// ── components ──
const tooltipStyle = {
  background: "#0d1426",
  border: "1px solid #1c2740",
  borderRadius: 8,
  fontSize: 12,
  color: "#e7eefc",
};

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: any; accent?: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className={`text-2xl font-bold ${accent === "warn" ? "text-warn" : "text-white"}`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] text-slate-400">{label}</div>
    </div>
  );
}

function MiniStat({
  label,
  sub,
  value,
  tone,
}: {
  label: string;
  sub: string;
  value: number;
  tone: "warn" | "neon" | "slate";
}) {
  const color =
    tone === "warn" ? "text-warn" : tone === "neon" ? "text-neon" : "text-slate-200";
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs font-medium text-white">{label}</div>
      <div className="text-[11px] text-slate-400">{sub}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] text-slate-400">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)} className="w-full px-2 py-2 text-sm">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function CreativityReview({
  rows,
  pw,
  onUpdated,
}: {
  rows: ResponseRow[];
  pw: string;
  onUpdated: () => void;
}) {
  async function rate(id: string, band: string) {
    await fetch("/api/admin/score", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
      body: JSON.stringify({ response_id: id, band }),
    });
    onUpdated();
  }
  if (!rows.length) return null;
  return (
    <Panel title={`Creativity responses — human rating (${rows.length})`} className="mt-4">
      <p className="mb-3 text-xs text-slate-400">
        Auto-scored heuristically. Override the band to set the final
        creativity TPS (high=1, medium=0.5, low=0).
      </p>
      <div className="max-h-96 space-y-2 overflow-auto">
        {rows.map((r) => {
          const current = r.creativity_manual_band ?? r.creativity_band;
          return (
            <div key={r.id} className="rounded-xl border border-white/8 bg-black/20 p-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">{r.question_id}</span>
                <span>
                  auto: {r.creativity_band}
                  {r.creativity_manual_band && ` · human: ${r.creativity_manual_band}`}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-200">{r.open_text || <em className="text-slate-500">empty</em>}</p>
              <div className="mt-2 flex gap-1.5">
                {["high", "medium", "low"].map((b) => (
                  <button
                    key={b}
                    onClick={() => rate(r.id, b)}
                    className={`rounded-lg border px-2.5 py-1 text-xs capitalize ${
                      current === b
                        ? "border-neon bg-neon/10 text-white"
                        : "border-white/10 text-slate-300 hover:border-neon/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function ExportButtons({
  participants,
  responses,
}: {
  participants: Participant[];
  responses: ResponseRow[];
}) {
  function download(name: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    download(
      "cognitive-research-export.json",
      JSON.stringify({ participants, responses }, null, 2),
      "application/json"
    );
  }

  function exportCsv() {
    // research-grade: one row per response, joined with demographics
    const pById = new Map(participants.map((p) => [p.id, p]));
    // participant-level columns (sourced from the participant record)
    const pCols = [
      "participant_code", "age", "gender", "profession",
      "duration_ms", "total_active_ms", "avg_question_ms",
    ];
    const cols = [
      ...pCols,
      "question_id", "level", "difficulty", "response_type",
      "selected_option", "correct_option", "is_correct", "confidence",
      "ai_hint_used", "ai_answer_used", "ai_answer_shown_correct", "ai_suggested_option",
      "tps", "aus", "ars", "waas", "mcs",
      "creativity_band", "creativity_manual_band",
      "time_spent_ms", "created_at", "open_text",
    ];
    const esc = (v: any) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [cols.join(",")];
    for (const r of responses) {
      const p = pById.get(r.participant_id) ?? {};
      lines.push(
        cols
          .map((c) => esc(pCols.includes(c) ? (p as any)[c] : r[c]))
          .join(",")
      );
    }
    download("cognitive-research-responses.csv", lines.join("\n"), "text/csv");
  }

  return (
    <div className="flex gap-2">
      <button onClick={exportCsv} className="btn-ghost text-sm">⬇ CSV</button>
      <button onClick={exportJson} className="btn-ghost text-sm">⬇ JSON</button>
    </div>
  );
}

function uniq(arr: any[], key: string): string[] {
  return Array.from(new Set(arr.map((x) => x[key]).filter(Boolean))).sort();
}
