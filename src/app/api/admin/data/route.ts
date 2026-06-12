import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

function authorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const got = req.headers.get("x-admin-password");
  return got === expected;
}

// Returns all participants + responses for the admin dashboard / export.
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const supabase = getServiceClient();
    const [{ data: participants, error: pErr }, { data: responses, error: rErr }] =
      await Promise.all([
        supabase.from("participants").select("*").order("started_at", { ascending: false }),
        supabase.from("responses").select("*").order("created_at", { ascending: true }),
      ]);
    if (pErr) throw pErr;
    if (rErr) throw rErr;
    return NextResponse.json({ participants: participants ?? [], responses: responses ?? [] });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to load data." },
      { status: 500 }
    );
  }
}
