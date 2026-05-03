import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/ses';
import { subscribeWelcomeHtml, subscribeWelcomeText } from '@/lib/emails/subscribe-welcome';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  const { email, _hp } = (body ?? {}) as Record<string, string>;

  // Honeypot — bots fill this, humans don't
  if (_hp) {
    return NextResponse.json({ success: true }); // silently accept
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 422 });
  }

  const cleanEmail = email.toLowerCase().trim();

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
      body: JSON.stringify({ email: cleanEmail, source: 'newsletter', joinedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8_000),
    }).catch((err) => console.error('[subscribe] webhook error:', err));
  }

  console.log('[subscribe] New subscriber:', cleanEmail);
  return NextResponse.json({ success: true });
}
