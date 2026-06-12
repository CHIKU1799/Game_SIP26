import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

// Create a participant after consent + onboarding. Returns its id + code.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age, gender, profession, consent_given, level_order } = body ?? {};

    if (!consent_given) {
      return NextResponse.json({ error: "Consent required." }, { status: 400 });
    }

    const code =
      "P-" +
      Math.random().toString(36).slice(2, 7).toUpperCase() +
      "-" +
      Date.now().toString(36).slice(-4).toUpperCase();

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from("participants")
      .insert({
        participant_code: code,
        age: age ?? null,
        gender: gender ?? null,
        profession: profession ?? null,
        consent_given: true,
        consent_at: new Date().toISOString(),
        level_order: level_order ?? null,
        user_agent: req.headers.get("user-agent") ?? null,
      })
      .select("id, participant_code")
      .single();

    if (error) throw error;

    await supabase.from("events").insert({
      participant_id: data.id,
      event_type: "consent_onboarding",
      payload: { age, gender, profession },
    });

    return NextResponse.json({ id: data.id, code: data.participant_code });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to create participant." },
      { status: 500 }
    );
  }
}
