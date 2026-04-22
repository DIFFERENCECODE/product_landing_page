// ═══════════════════════════════════════════════════════════════
//  /api/waitlist/route.ts  — NEW (not copied from old repo)
//  ─────────────────────────────────────────────────────────────
//  POST { email: string; source: string }
//    → { success: true }   on success
//    → { success: false, error: string }  on failure
//
//  Storage strategy (stubbed):
//  ─────────────────────────────────────────────────────────────
//  Currently: validates input and logs to console.  Ship-ready for
//  wiring to your MeO RDS database or AWS SES pipeline.
//
//  To wire storage, set WAITLIST_WEBHOOK_URL in .env.local to a
//  backend endpoint that accepts:
//    POST { email: string; source: string; joinedAt: string }
//  The route will forward the payload and surface any errors.
//
//  Typical next steps:
//    1. Supabase: INSERT INTO waitlist (email, source, joined_at)
//    2. RDS:  POST to your /internal/waitlist ingestion endpoint
//    3. Loops/Mailchimp: add subscriber via provider SDK
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type WaitlistPayload = {
  email: string;
  source: string;
};

// Basic RFC 5322 email validation — no external dependency needed
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { email, source } = (body ?? {}) as Partial<WaitlistPayload>;

  // ── Input validation ──────────────────────────────────────────
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: "A valid email address is required." },
      { status: 422 }
    );
  }

  if (!source || typeof source !== "string") {
    return NextResponse.json(
      { success: false, error: "source is required." },
      { status: 422 }
    );
  }

  const payload = {
    email: email.toLowerCase().trim(),
    source,
    joinedAt: new Date().toISOString(),
  };

  // ── Forward to external service if configured ─────────────────
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const forwardRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Reasonable timeout — don't block the user forever
        signal: AbortSignal.timeout(8_000),
      });

      if (!forwardRes.ok) {
        const text = await forwardRes.text().catch(() => "");
        console.error(
          `[waitlist] Webhook returned ${forwardRes.status}: ${text}`
        );
        return NextResponse.json(
          { success: false, error: "Waitlist service unavailable. Please try again." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[waitlist] Webhook request failed:", err);
      return NextResponse.json(
        { success: false, error: "Waitlist service unavailable. Please try again." },
        { status: 502 }
      );
    }
  } else {
    // No webhook configured — log and succeed (dev / stub mode)
    console.log("[waitlist] New signup (stub — wire WAITLIST_WEBHOOK_URL):", payload);
  }

  return NextResponse.json({ success: true });
}
