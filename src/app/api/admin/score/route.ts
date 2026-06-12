import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return req.headers.get("x-admin-password") === expected;
}

// Human override of a creativity response's band (high/medium/low).
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const { response_id, band } = await req.json();
    if (!response_id || !["high", "medium", "low"].includes(band)) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }
    const tps = band === "high" ? 1 : band === "medium" ? 0.5 : 0;
    const supabase = getServiceClient();
    const { error } = await supabase
      .from("responses")
      .update({ creativity_manual_band: band, tps, is_correct: band === "high" })
      .eq("id", response_id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to update score." },
      { status: 500 }
    );
  }
}
