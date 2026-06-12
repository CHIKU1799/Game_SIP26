import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

// Upsert a single per-question response (idempotent on participant+question).
export async function POST(req: NextRequest) {
  try {
    const { participant_id, record, events } = await req.json();
    if (!participant_id || !record) {
      return NextResponse.json({ error: "Missing data." }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from("responses")
      .upsert(
        { participant_id, ...record },
        { onConflict: "participant_id,question_id" }
      );
    if (error) throw error;

    if (Array.isArray(events) && events.length) {
      await supabase.from("events").insert(
        events.map((ev: any) => ({
          participant_id,
          event_type: ev.type,
          payload: ev.payload ?? null,
        }))
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to save response." },
      { status: 500 }
    );
  }
}
