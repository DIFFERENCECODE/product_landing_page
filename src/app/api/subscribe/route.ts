import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/ses';
import { subscribeWelcomeHtml, subscribeWelcomeText } from '@/lib/emails/subscribe-welcome';
import { query } from '@/lib/db';
import { pushToBeehiiv } from '@/lib/beehiiv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

function splitName(raw: string | undefined): { first: string | null; last: string | null } {
  if (!raw) return { first: null, last: null };
  const trimmed = raw.trim();
  if (!trimmed) return { first: null, last: null };
  const parts = trimmed.split(/\s+/);
  return {
    first: parts[0] || null,
    last: parts.length > 1 ? parts.slice(1).join(' ') : null,
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  const { email, name, first_name, last_name, _hp } = (body ?? {}) as Record<string, string>;

  // Honeypot — bots fill this, humans don't
  if (_hp) {
    return NextResponse.json({ success: true }); // silently accept
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 422 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const ip = getClientIp(req);

  // Resolve name: explicit first/last wins; else split a single name field
  let firstName: string | null = first_name?.trim() || null;
  let lastName: string | null = last_name?.trim() || null;
  if (!firstName && !lastName && name) {
    const split = splitName(name);
    firstName = split.first;
    lastName = split.last;
  }

  // Persist to RDS — non-blocking on failure so welcome email still ships
  try {
    await query(
      `INSERT INTO newsletter_subscribers
         (email, first_name, last_name, ip_address, source, subscription_date, sources_seen)
       VALUES ($1, $2, $3, $4, 'newsletter', now(), 'meterbolic.com')
       ON CONFLICT (email) DO UPDATE SET
         first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), newsletter_subscribers.first_name),
         last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), newsletter_subscribers.last_name),
         ip_address = COALESCE(EXCLUDED.ip_address, newsletter_subscribers.ip_address),
         source = COALESCE(newsletter_subscribers.source, EXCLUDED.source),
         subscription_date = COALESCE(newsletter_subscribers.subscription_date, EXCLUDED.subscription_date),
         sources_seen = CASE
           WHEN newsletter_subscribers.sources_seen IS NULL OR newsletter_subscribers.sources_seen = ''
             THEN EXCLUDED.sources_seen
           WHEN position(EXCLUDED.sources_seen in newsletter_subscribers.sources_seen) > 0
             THEN newsletter_subscribers.sources_seen
           ELSE newsletter_subscribers.sources_seen || '|' || EXCLUDED.sources_seen
         END`,
      [cleanEmail, firstName, lastName, ip],
    );
  } catch (err) {
    console.error('[subscribe] DB insert failed:', err);
  }

  // Push to Beehiiv — fire and forget, never blocks the user response
  pushToBeehiiv(cleanEmail, {
    firstName,
    lastName,
    ip,
    source: 'meterbolic.com',
  })
    .then((r) => {
      if (!r.ok) console.error('[subscribe] beehiiv push failed:', r.status, r.error);
    })
    .catch((err) => console.error('[subscribe] beehiiv push threw:', err));

  await sendEmail({
    to: cleanEmail,
    subject: "You're in — your free extract of The Thin Book of Fat",
    html: subscribeWelcomeHtml({ email: cleanEmail }),
    text: subscribeWelcomeText({ email: cleanEmail }),
  });

  // Forward to waitlist webhook if configured
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        first_name: firstName,
        last_name: lastName,
        ip,
        source: 'newsletter',
        joinedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8_000),
    }).catch((err) => console.error('[subscribe] webhook error:', err));
  }

  console.log('[subscribe] New subscriber:', cleanEmail, firstName ? `(${firstName})` : '');
  return NextResponse.json({ success: true });
}
