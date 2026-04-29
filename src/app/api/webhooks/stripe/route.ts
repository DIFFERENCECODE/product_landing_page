// ═══════════════════════════════════════════════════════════════
//  /api/webhooks/stripe/route.ts  — NEW (not copied from old repo)
//  ─────────────────────────────────────────────────────────────
//  Handles Stripe webhook events.
//
//  Currently handles:
//    - checkout.session.completed
//        → auto-enrolls customer email in waitlist
//
//  Resilience:
//    - Waitlist failure does NOT cause the webhook to fail.
//      Stripe will not retry for a transient waitlist issue.
//    - Waitlist enrolment here backs up the success-page enrolment,
//      ensuring it runs even if the customer never returns.
//
//  Setup:
//    1. Dashboard: Stripe > Developers > Webhooks > Add endpoint
//       URL: https://yourdomain.com/api/webhooks/stripe
//       Events: checkout.session.completed
//    2. Copy the signing secret → STRIPE_WEBHOOK_SECRET in .env.local
//    3. Local dev: stripe listen --forward-to localhost:3000/api/webhooks/stripe
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/ses";
import { purchaseConfirmationHtml, purchaseConfirmationText } from "@/lib/emails/purchase-confirmation";
import type Stripe from "stripe";

// Required on Vercel: lets us read the raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  // Read raw body as buffer for signature verification
  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature.";
    console.error("[stripe-webhook] Signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // ── Route events ─────────────────────────────────────────────

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }

    default:
      // Ignore unhandled event types — return 200 to acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true });
}

// ── Event handlers ────────────────────────────────────────────

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const name = session.customer_details?.name;

  console.log(
    `[stripe-webhook] checkout.session.completed — id=${session.id} email=${email ?? "unknown"}`
  );

  if (!email) {
    console.warn(
      "[stripe-webhook] No customer email in session, skipping waitlist enrolment."
    );
    return;
  }

  // Purchase confirmation email — fire & forget.
  sendEmail({
    to: email,
    subject: "Your Meo Starter System is confirmed",
    html: purchaseConfirmationHtml({ name: name ?? "", email, orderId: session.id }),
    text: purchaseConfirmationText({ name: name ?? "", email, orderId: session.id }),
  }).catch((err) => {
    console.error("[stripe-webhook] Purchase confirmation email failed:", err);
  });

  // Enrol in waitlist — fire & forget. Failure is logged but does not
  // surface to Stripe (which would cause a retry and potential duplicate).
  enrollInWaitlist(email, name ?? undefined).catch((err) => {
    console.error("[stripe-webhook] Waitlist enrolment failed:", err);
  });
}

async function enrollInWaitlist(email: string, _name?: string): Promise<void> {
  // Build the internal waitlist URL.  On Vercel the NEXT_PUBLIC_BASE_URL env
  // var is present at runtime; in the webhook handler we're server-side so
  // using absolute URL is required.
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      source: "stripe-webhook",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Waitlist API returned ${res.status}: ${text}`);
  }
}
