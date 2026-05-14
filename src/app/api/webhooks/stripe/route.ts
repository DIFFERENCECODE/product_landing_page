// ═══════════════════════════════════════════════════════════════
//  /api/webhooks/stripe/route.ts
//  ─────────────────────────────────────────────────────────────
//  Handles Stripe webhook events for the Meo storefront.
//
//  Currently handles:
//    - checkout.session.completed
//        1. Provisions a Cognito user in the meo-user-pool so the
//           buyer can sign in to app.meterbolic.com. Cognito emails
//           the temporary password automatically (default invite).
//        2. Sends a plan-specific fulfillment email containing:
//             - eBook access (link + shared credentials)
//             - app.meterbolic.com sign-in details
//             - coaching info (if plan === 'coached')
//        3. Enrols the customer in the marketing list (newsletter_subscribers
//           via /api/waitlist) — fire & forget, never blocks the webhook.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { sendEmail } from '@/lib/ses';
import { fulfillmentHtml, fulfillmentText, fulfillmentSubject } from '@/lib/emails/fulfillment';
import { provisionTrialUser } from '@/lib/cognito';
import { sendMetaPurchase } from '@/lib/meta-capi';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

type Plan = 'lite' | 'starter' | 'coached';

function parsePlan(meta: Stripe.Metadata | undefined | null): Plan {
  const raw = meta?.plan;
  if (raw === 'lite' || raw === 'coached') return raw;
  return 'starter';
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 });
  }

  const rawBody = await req.arrayBuffer();
  const bodyBuffer = Buffer.from(rawBody);

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature.';
    console.error('[stripe-webhook] Signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const name = session.customer_details?.name ?? '';
  const plan = parsePlan(session.metadata);
  const firstName = name.trim().split(/\s+/)[0] ?? '';

  const utm = {
    source: session.metadata?.utm_source ?? '(direct)',
    medium: session.metadata?.utm_medium ?? '(none)',
    campaign: session.metadata?.utm_campaign ?? '(none)',
  };

  console.log(
    `[stripe-webhook] checkout.session.completed id=${session.id} email=${email ?? 'unknown'} ` +
      `plan=${plan} amount=${session.amount_total} currency=${session.currency} ` +
      `utm=${utm.source}/${utm.medium}/${utm.campaign}`,
  );

  if (!email) {
    console.warn('[stripe-webhook] No customer email — skipping fulfillment.');
    return;
  }

  // 1. Provision Cognito user (or detect existing). Cognito will email the
  //    temporary password directly from AWS — we don't put the password in
  //    our own email.
  let cognitoCreated = false;
  try {
    const r = await provisionTrialUser(email, name || null);
    if (r.ok) {
      cognitoCreated = r.created;
      console.log(
        `[stripe-webhook] Cognito ${r.created ? 'created' : 'already exists'}: ${r.email}`,
      );
    } else {
      console.error('[stripe-webhook] Cognito provision failed:', r.error);
    }
  } catch (err) {
    console.error('[stripe-webhook] Cognito provision threw:', err);
  }

  // 2. Plan-specific fulfillment email (eBook access + app sign-in instructions).
  sendEmail({
    to: email,
    subject: fulfillmentSubject(plan),
    html: fulfillmentHtml({ plan, firstName, email, orderId: session.id }),
    text: fulfillmentText({ plan, firstName, email, orderId: session.id }),
  }).catch((err) => {
    console.error('[stripe-webhook] Fulfillment email failed:', err);
  });

  // 3. Newsletter enrolment — fire & forget. Never block the webhook on this.
  enrollInWaitlist(email, name || undefined).catch((err) => {
    console.error('[stripe-webhook] Waitlist enrolment failed:', err);
  });

  // 4. Meta Conversions API — server-side Purchase event. Recovers
  //    conversions Meta would otherwise miss because of iOS Safari ITP
  //    or ad blockers stripping the browser Pixel. event_id matches the
  //    session id so Meta dedupes with the browser event.
  if (session.amount_total) {
    const [first, ...rest] = name.split(/\s+/);
    sendMetaPurchase({
      email,
      firstName: first || null,
      lastName: rest.length ? rest.join(' ') : null,
      value: session.amount_total / 100,
      currency: (session.currency ?? 'gbp').toUpperCase(),
      eventId: session.id,
    })
      .then((r) => {
        if (!r.ok) console.error('[stripe-webhook] Meta CAPI failed:', r.error);
      })
      .catch((err) => console.error('[stripe-webhook] Meta CAPI threw:', err));
  }

  console.log(
    `[stripe-webhook] fulfillment dispatched: plan=${plan} cognito_created=${cognitoCreated} email=${email}`,
  );
}

async function enrollInWaitlist(email: string, _name?: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://meterbolic.com';

  const res = await fetch(`${baseUrl}/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source: 'stripe-webhook' }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Waitlist API returned ${res.status}: ${text}`);
  }
}
