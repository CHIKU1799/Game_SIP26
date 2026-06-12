import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

// Mark a session complete and persist aggregate scores.
export async function POST(req: NextRequest) {
  try {
    const { participant_id, scores } = await req.json();
    if (!participant_id || !scores) {
      return NextResponse.json({ error: "Missing data." }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { error } = await supabase
      .from("participants")
      .update({
        completed_at: new Date().toISOString(),
        tps_total: scores.tps_total,
        tps_max: scores.tps_max,
        accuracy_pct: scores.accuracy_pct,
        aus_total: scores.aus_total,
        ars_total: scores.ars_total,
        waas_total: scores.waas_total,
        mcs_total: scores.mcs_total,
        src: scores.src,
        human_only_pct: scores.human_only_pct,
      })
      .eq("id", participant_id);
    if (error) throw error;

    await supabase.from("events").insert({
      participant_id,
      event_type: "complete",
      payload: scores,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to complete session." },
      { status: 500 }
    );
  }
}
